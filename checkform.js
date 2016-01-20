var checkValI= 0;//variable for id of message for input
(function ( $ ) {
	$.fn.checkForm = function(options){

		/*
		 Variables
		 */

		var nec_inp = this.find('input[inputnec]').length; //number of necessarily inputs
		var submitbutton = this.find('input[submitcheck]'); //submitbutton
		var form = this; //form
		var inputCheck = this.find('input[inputcheck]');
		var inputCheckAjax = this.find('input[inputcheckajax]');
		var blurInp =  this.find('input[type=text]');

		options = filterOptions(options);

		/*
		 Check if values is auto filled
		 */

		inputCheck.add(inputCheckAjax).each(function () {
			var input = jQuery(this);

			input.data('options', options);
			input.checkInput();
		});


		/*
		 Some events
		 */

		form.attr('nec_inp',nec_inp);
		if(nec_inp>0)
			submitbutton.prop('disabled',true);
		inputCheck.add(inputCheckAjax).blur(onBlur);
	};

	$.fn.addInputCheckVal = function(elem,options) {

		/*
		 Variables
		 */
		var form = this;//form
		var nec_inp = this.find('input[inputnec]').length; //number of necessarily inputs
		var submitbutton = this.find('input[submitcheck]'); //submitbutton
		var blurInp =  this.find('input[type=text]');

		options = filterOptions(options);

		/*
		 Check if values is auto filled
		 */

		elem.each(function () {
			var input = jQuery(this);

			input.data('options', options);
			input.checkInput();
		});

		/*
		 Some events
		 */

		form.attr('nec_inp', nec_inp);
		if(nec_inp > 0)
			submitbutton.prop('disabled', true);
		elem.blur(onBlur);
	};

	$.fn.checkInput = function() { //blurInput- that function checks your input(event - can be jQuery object)
		var elem = this;
		var neces = !CheckFormHelper.isUndefined(elem.attr('inputnec'));
		var calfunc = !CheckFormHelper.isUndefined(elem.attr('inputcheck')) && elem.attr('inputcheck') != '';
		var calfuncajax = !CheckFormHelper.isUndefined(elem.attr('inputcheckajax'));
		var arguments = CheckFormHelper.defaultParameter(elem.attr('inputarg'), '');

		var options = elem.data('options');
		var addHTML = options.addHTML;

		arguments = JSON.parse('{'+arguments+'}');
		if(calfunc || calfuncajax) {
			if(elem.val()!='') {
				var func;
				if(calfuncajax) {
					func = elem.attr('inputcheckajax');
					window[func](elem,elem.val(), arguments);
				}
				else {
					func = elem.attr('inputcheck');
					var returnedVal = window[func](elem.val(), arguments);
					if(returnedVal) {
						CheckFormHelper.addRight(elem, neces, addHTML);
					}else {
						CheckFormHelper.addError(elem, neces, elem.attr('text_error'), addHTML);
					}
				}
			}else {
				CheckFormHelper.removeRight(elem, neces);
			}
		}
		else {
			CheckFormHelper.typical(elem, neces, addHTML);
		}
		if(neces&&!calfuncajax)
			CheckFormHelper.formValid(this.parents('form[formcheck]'));
	};

	function onBlur(event) {
		jQuery(event.target).checkInput();
	}

	function filterOptions(options) {
		var obj = {};//empty object if options is undefinded

		options = CheckFormHelper.defaultParameter(options,obj);//if options not filled
		options.addHTML = CheckFormHelper.defaultParameter(options.addHTML,'<div class = "valCheck"><div class="valCheckSymbol"></div><div class = "valCheckText"></div></div>');//default param for html that past to input
		return options;
	}

}( jQuery ));

function CheckFormHelper() {}

CheckFormHelper.checkValAjax = function(elem, val, addHTML) {
	var neces = !CheckFormHelper.isUndefined(jQuery(this).attr('inputnec'));

	addHTML = CheckFormHelper.defaultParameter(addHTML,'<div class = "valCheck"><div class="valCheckSymbol"></div> <div class = "valCheckText"></div></div>');
	if(val) {
		CheckFormHelper.addRight(elem, neces, addHTML);
	}else {
		CheckFormHelper.addError(elem, neces, elem.attr('text_error'), addHTML);
	}
	CheckFormHelper.formValid(elem.parents('form[formcheck]'));
};

CheckFormHelper.typical = function(elem,sm,html) {
	if(elem.val()=='')
		CheckFormHelper.removeRight(elem,sm,html);
	else if(elem.val())
		CheckFormHelper.addRight(elem,sm,html);
};

//add message to inputs after filling them
CheckFormHelper.addError = function(elem, sm, text, html) {//function if input filled wrong(elem - (jQuery Object) jQuery element, sm - (bool) input is necessarily?, text - text of error)
	sm = CheckFormHelper.defaultParameter(sm, false);

	if(CheckFormHelper.isUndefined(elem.attr('id_input_message'))){
		elem.after(html);
		elem.next().attr('valCheckId',checkValI);

		elem.attr('id_input_message',checkValI);
		checkValI++;
	}

	var id = elem.attr('id_input_message');
	var valCheckElem = jQuery('*[valCheckId='+id+']');
	var valCheckElemText = jQuery('*[valCheckId='+id+'] .valCheckText');

	if(valCheckElem.attr('right') == 1){
		valCheckElemText.animate({opacity:1},100);
		elem.removeClass('right');
	}

	elem.attr('closed','-');

	elem.addClass('wrong');

	valCheckElem.attr('right', 0);

	var elemPosition = elem.offset();
	var left = elemPosition.left + elem.outerWidth(true) + 5;
	var top = elemPosition.top + (elem.outerHeight(true) - valCheckElem.outerHeight(true))/2;
	valCheckElem.offset({top: top, left: left});

	valCheckElemText.text(text);
	valCheckElem.animate({opacity:1},500);
	CheckFormHelper.formValid(elem.parents('form[formcheck]'));
};

CheckFormHelper.removeRight = function(elem, sm) {//function if input clean(elem - (jQuery Object) jQuery element, sm - (bool) input is necessarily?)
	sm = CheckFormHelper.defaultParameter(sm, false);
	var id = elem.attr('id_input_message');
	if(!CheckFormHelper.isUndefined(id)) {
		jQuery('*[valCheckId='+id+']').animate({opacity:0},100);
		elem.attr('closed','none');
		elem.removeClass('right');
		elem.removeClass('wrong');
	}
	CheckFormHelper.formValid(elem.parents('form[formcheck]'));
};

CheckFormHelper.addRight = function(elem, sm, html) {//function if input filled right(elem - (jQuery Object) jQuery element, sm - (bool) input is necessarily?)
	sm = CheckFormHelper.defaultParameter(sm, false);
	if (CheckFormHelper.isUndefined(elem.attr('id_input_message'))){
		elem.after(html);
		elem.next().attr('valCheckId',checkValI);

		elem.attr('id_input_message',checkValI);
		checkValI++;
	}
	var id = elem.attr('id_input_message');
	var valCheckElem = jQuery('*[valCheckId='+id+']');
	var valCheckElemText = jQuery('*[valCheckId='+id+'] .valCheckText');

	if(valCheckElem.attr('right') == 0){
		valCheckElemText.animate({opacity:0}, 100);
		elem.removeClass('wrong');
	}

	valCheckElem.attr('right', 1);
	elem.addClass('right');

	var elemPosition = elem.offset();
	var left = elemPosition.left + elem.outerWidth(true) + 5;
	var top = elemPosition.top + (elem.outerHeight(true) - valCheckElem.outerHeight(true))/2;
	valCheckElem.offset({top: top, left: left});

	elem.attr('closed', '+');
	valCheckElem.animate({opacity:1}, 100);
	CheckFormHelper.formValid(elem.parents('form[formcheck]'));
};

CheckFormHelper.formValid = function(elem) {
	var num = 0;
	elem.find('input[inputnec]').each(function() {
		if(jQuery(this).attr('closed')=='+')
			num++;
	});
	if(num == elem.attr('nec_inp')) {
		elem.find('input[submitcheck]').removeAttr('disabled');
	} else {
		elem.find('input[submitcheck]').prop('disabled', true);
	}
};

CheckFormHelper.defaultParameter = function(param, def_val) {
	return typeof param !== 'undefined' ? param : def_val;
};

CheckFormHelper.isUndefined = function(value) {
	return typeof value == 'undefined'
};

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
