/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

const { utils } = require("stylelint");

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

  class Product{
    constructor (id, data){
      const thisProduct = this;

      thhisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();

      console.log('new product:',thisProduct);
    }

    renderInMenu(){
      const thisProduct = this;
/* generate HTML baased on template*/
const generatedHTML = templates.menuProduct(thisProduct.data);

/* creat element using utils.createElementFromHTML*/
thisProduct.element - utils.createDOMFromHTML(generatedHTML);

/* FIND MENU CoNTAINER*/

/* ad element to Menu*/
menuCintainer.appendChild(thisProduct.element);

    }
  }
   
  initAccordion(){
    const thisProduct = this;
    /* find the clickable trigger (the element that should react to clicking) */
    const clickableTrigger = thisProduct;

    /* START: add event listener to clickable trigger on event click */
    clickableTrigger.addEventListener('click', function(event) {
      /* prevent default action for event */
      const titleClickHandler = function(event){
        event.preventDefault();
        const clickedElement = this;

      /* find active product (product that has active class) */
      const activeProducts = document.querySelectorAll('a.active[href^="#product-"]');

      /* if there is active product and it's not thisProduct.element, remove class active from it */
      thisProduct.element = thisProduct; 
      /* toggle active class on thisProduct.element */
      thisProduct.element.toggle('active')
    };
    
  }
}

const buttonTest = document.getElementById('button-test');

buttonTest.addEventListener('click', function(){
  console.log('clicked');
});

  const app = {
    initMenu:function(){
      const testProduct = new Product();
      console.log('testProduct:',testProduct);
  },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
    },
  };

  app.initMenu{
    const thisApp = this;
    console.log('thisApp.data',thisApp.data);
    for(let productData in thisApp.data.products){
      new Product(productData, thisApp.data.product[productData]);
    }


  initData: function(){
    const thisApp = this;

    thisApp.data = dataSource;
  }
  thisApp.initData();
  app.init();thisApp.initMenu();
}
}
