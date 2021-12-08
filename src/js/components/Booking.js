import { templates,select, settings, classNames } from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element){
    const thisBooking = this; 
    thisBooking.selectedTable = [];
    thisBooking.render(element);
    thisBooking.initWidgets();
  } 
 
  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    
    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }
    for (let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }
      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      }else{
        table.classList.remove(classNames.booking.tableBooked);
      }
    }


  }

  render(element){
    const thisBooking = this;
    /*generate HTML based on template*/
    const generatedHTML = templates.bookingWidget(element);
    /*create an empty object*/
    thisBooking.dom = {};
    /*add wrapper to the object*/
    thisBooking.dom.wrapper = element;
    /*change innerHTML to generatedHTML*/ 
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    
    thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = element.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables= thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.booking.floorPlan);
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
    thisBooking.dom.phone = thisBooking.dom.form.querySelector(select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.form.querySelector(select.booking.address);
    thisBooking.dom.starters = thisBooking.dom.form.querySelectorAll(select.booking.starters);
  }

  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('updated',function(){
      thisBooking.removeTableSelection();

    });
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('updated',function(){
      thisBooking.removeTableSelection();
    });
    /*thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });*/
    thisBooking.dom.floorPlan.addEventListener('click',function(event){
      thisBooking.initTables(event);
    });
    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    });

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
  }
}

export default Booking;