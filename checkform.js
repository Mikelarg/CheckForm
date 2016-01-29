/* Created by Mikelarg (c) 2015 */
var checkValI= 0;//variable for id of message for input
(function ( $ ) {
	$.fn.checkForm = function(options){

		/*
		 Variables
		 */

		var necessaryInput = this.find('input[inputnec]').length; //number of necessarily inputs
		var submitButton = this.find('input[submitcheck]'); //submit button
		var form = this; //form
		var inputCheck = this.find('input[inputcheck]');
		var inputCheckAjax = this.find('input[inputcheckajax]');

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

		form.attr('nec_inp',necessaryInput);
		if(necessaryInput>0)
			submitButton.prop('disabled',true);

		inputCheck.add(inputCheckAjax).unbind("blur", onBlur);
		inputCheck.add(inputCheckAjax).blur(onBlur);
	};

	$.fn.addInputCheckVal = function(elem,options) {

		/*
		 Variables
		 */
		var form = this;//form
		var necessaryInput = this.find('input[inputnec]').length; //number of necessarily inputs
		var submitButton = this.find('input[submitcheck]'); //submit button

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

		form.attr('nec_inp', necessaryInput);
		if(necessaryInput > 0)
			submitButton.prop('disabled', true);

		elem.unbind('blur', onBlur);
		elem.blur(onBlur);
	};

	$.fn.checkInput = function() { //blurInput- that function checks your input(event - can be jQuery object)
		var elem = this;
		var necessary = !CheckFormHelper.isUndefined(elem.attr('inputnec'));
		var callFunc = !CheckFormHelper.isUndefined(elem.attr('inputcheck')) && elem.attr('inputcheck') != '';
		var calFuncAjax = !CheckFormHelper.isUndefined(elem.attr('inputcheckajax'));
		var arguments = CheckFormHelper.defaultParameter(elem.attr('inputarg'), '');

		var options = elem.data('options');
		var addHTML = options.addHTML;

		arguments = JSON.parse('{'+arguments+'}');
		if(callFunc || calFuncAjax) {
			if(elem.val()!='') {
				var func;
				if(calFuncAjax) {
					func = elem.attr('inputcheckajax');
					window[func](elem,elem.val(), arguments);
				}
				else {
					func = elem.attr('inputcheck');
					var returnedVal = window[func](elem.val(), arguments);
					if(returnedVal) {
						CheckFormHelper.addRight(elem, addHTML);
					}else {
						CheckFormHelper.addError(elem, elem.attr('text_error'), addHTML);
					}
				}
			}else {
				CheckFormHelper.removeRight(elem);
			}
		}
		else {
			CheckFormHelper.typical(elem, addHTML);
		}
		if(necessary&&!calFuncAjax)
			CheckFormHelper.formValid(this.parents('form[formcheck]'));
	};

	$.fn.onRightInput = function(event, override) {
		override = CheckFormHelper.defaultParameter(override, false);
		this.data('overrideOnRightInput', override);
		this.bind('onRightInput', event);
	};

	$.fn.onWrongInput = function(event, override) {
		override = CheckFormHelper.defaultParameter(override, false);
		this.data('overrideOnWrongInput', override);
		this.bind('onWrongInput', event);
	};

	$.fn.onRemoveStateInput = function(event, override) {
		override = CheckFormHelper.defaultParameter(override, false);
		this.data('overrideOnRemoveStateInput', override);
		this.bind('onRemoveStateInput', event);
	};

	$.fn.changeErrorMessage = function(message) {
		this.attr('text_error', message);
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
	addHTML = CheckFormHelper.defaultParameter(addHTML,'<div class = "valCheck"><div class="valCheckSymbol"></div> <div class = "valCheckText"></div></div>');
	if(val) {
		CheckFormHelper.addRight(elem, addHTML);
	}else {
		CheckFormHelper.addError(elem, elem.attr('text_error'), addHTML);
	}
	CheckFormHelper.formValid(elem.parents('form[formcheck]'));
};

CheckFormHelper.typical = function(elem, html) {
	if(elem.val() == '')
		CheckFormHelper.removeRight(elem, html);
	else if(elem.val())
		CheckFormHelper.addRight(elem, html);
};

//add message to inputs after filling them
CheckFormHelper.addError = function(elem, text, html) {//function if input filled wrong(elem - (jQuery Object) jQuery element, sm - (bool) input is necessarily?, text - text of error)
	var override = elem.data('overrideOnWrongInput');

	elem.attr('closed', '-');

	if (elem.hasClass('right')) elem.removeClass('right');
	elem.addClass('wrong');

	if (!override) {
		if (CheckFormHelper.isUndefined(elem.attr('id_input_message'))) {
			elem.after(html);
			elem.next().attr('valCheckId', checkValI);

			elem.attr('id_input_message', checkValI);
			checkValI++;
		}

		var id = elem.attr('id_input_message');
		var valCheckElem = jQuery('*[valCheckId=' + id + ']');
		var valCheckElemText = jQuery('*[valCheckId=' + id + '] .valCheckText');

		if (valCheckElem.attr('right') == 1) valCheckElemText.animate({opacity: 1}, 100);

		valCheckElem.attr('right', 0);

		var elemPosition = elem.offset();
		var left = elemPosition.left + elem.outerWidth(true) + 5;
		var top = elemPosition.top + (elem.outerHeight(true) - valCheckElem.outerHeight(true)) / 2;
		valCheckElem.offset({top: top, left: left});

		valCheckElemText.text(text);
		valCheckElem.animate({opacity: 1}, 500);
	}

	elem.trigger('onWrongInput', html, text);
	CheckFormHelper.formValid(elem.parents('form[formcheck]'));
};

CheckFormHelper.removeRight = function(elem) {//function if input clean(elem - (jQuery Object) jQuery element, sm - (bool) input is necessarily?)
	var id = elem.attr('id_input_message');
	var override = elem.data('overrideOnRemoveStateInput');

	elem.attr('closed','none');
	elem.removeClass('right');
	elem.removeClass('wrong');

	if (!CheckFormHelper.isUndefined(id) && !override) jQuery('*[valCheckId='+id+']').animate({opacity:0},100);

	elem.trigger('onRemoveStateInput');
	CheckFormHelper.formValid(elem.parents('form[formcheck]'));
};

CheckFormHelper.addRight = function(elem, html) {//function if input filled right(elem - (jQuery Object) jQuery element, sm - (bool) input is necessarily?)
	var override = elem.data('overrideOnRightInput');

	if (elem.hasClass('wrong')) elem.removeClass('wrong');
	elem.addClass('right');

	elem.attr('closed', '+');

	if (!override) {
		if (CheckFormHelper.isUndefined(elem.attr('id_input_message'))) {
			elem.after(html);
			elem.next().attr('valCheckId', checkValI);

			elem.attr('id_input_message', checkValI);
			checkValI++;
		}
		var id = elem.attr('id_input_message');
		var valCheckElem = jQuery('*[valCheckId=' + id + ']');
		var valCheckElemText = jQuery('*[valCheckId=' + id + '] .valCheckText');

		if (valCheckElem.attr('right') == 0) valCheckElemText.animate({opacity: 0}, 100);

		valCheckElem.attr('right', 1);

		var elemPosition = elem.offset();
		var left = elemPosition.left + elem.outerWidth(true) + 5;
		var top = elemPosition.top + (elem.outerHeight(true) - valCheckElem.outerHeight(true)) / 2;
		valCheckElem.offset({top: top, left: left});
		valCheckElem.animate({opacity:1}, 100);
	}

	elem.trigger('onRightInput', html);
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
