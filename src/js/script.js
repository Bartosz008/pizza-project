/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();
      thisProduct.amountWidgetElem();
      thisProduct.initAmountWidget();
      thisProduct.initActions();

      

      console.log('new product:', thisProduct);
    }

    renderInMenu() {
      const thisProduct = this;

      /* generate HTML baased on template*/
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /* creat element using utils.createElementFromHTML*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* FIND MENU CoNTAINER*/
      const menuContainer = document.querySelector(select.containerOf.menu);
      /* ad element to Menu*/
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    getElements(element){
      const thisWidget = this;
  
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    initAccordion() {
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

      /* START: add event listener to clickable trigger on event click */
      clickableTrigger.addEventListener('click', function (event) {
        /* prevent default action for event */
        event.preventDefault();

        /* find active product (product that has active class) */
        const activeProduct = thisProduct.imageWrapper.querySelector('.product.active');

        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if (activeProduct && activeProduct !== thisProduct.element) activeProduct.classList.remove('active');

        /* toggle active class on thisProduct.element */
        thisProduct.element.classList.toggle('active');

      });
    }

    initOrderForm() {
    
      const thisProduct = this;
      console.log('initOrderForm');
      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
    
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    }

    initAmountWidget() {

      const thisProduct = this;
      
      thisProduct.amountWidget = AmountWidget(thisProduct.amountWidget.Elem);
    
    }

    processOrder() {

      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);

      let price = thisProduct.data.price;

      // for every category (param)...
      for(let paramId in thisProduct.data.params) {

        const param = thisProduct.data.params[paramId];

        // for every option in this category
        for(let optionId in param.options) {
          const option = param.options[optionId];

          // check if there is param with a name of paramId in formData and if it includes optionId
          if(formData[paramId] && formData[paramId].includes(optionId)) {
            if(!option.default) price += option.price;
          } else {
            if(option.default) price -= option.price;
          }

          const optionImage = document.querySelector('.' + paramId + '-' + optionId);
          if(optionImage) {
            if(formData[paramId] && formData[paramId].includes(optionId)) {
              optionImage.classList.add('active');
            } else {
              optionImage.classList.remove('active');
            }
          }

        }
      }
  
      thisProduct.priceElem.innerHTML = price;
    }

setValue(value){
  const thisWidget = this;
  const newValue = parseInt(value);
  /*TODO: Ad validation*/
  if(thisWidget.value !== newValue && !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <=settings.amountWidget.defaultMax) {
    thisWidget.value = newValue;
  }
  thisWidget.announce();
  thisWidget.input.value = thisWidget.value;
}

initActions(){
  const thisWidget = this;
  thisWidget.input.addEventListener('change', function(){
    thisWidget.setValue(thisWidget.input.value);
  });
  thisWidget.linkDecrease.addEventListener('click', function(event){
    event.preventDefault();
    thisWidget.setValue(thisWidget.value -1 );
  });
  thisWidget.linkIncrease.addEventListener('click',function(event){
    event.preventDefault();
    thisWidget.setValue(thisWidget.value +1 );
  });
}

 class AmountWidget {
    constructor (element){
      const thisWidget = this;
      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();

      //console.log('AmountWidget:', thisWidget);//
      //console.log('constructor arguments:', element);//
    }
  }


  const app = {
    initMenu: function () {
      const thisApp = this;
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function () {
      const thisApp = this;
      thisApp.initData();
      thisApp.initMenu();
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
    },
  };

  app.init();
}
