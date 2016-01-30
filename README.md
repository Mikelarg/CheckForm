# CheckForm
CheckForm — jQuery plugin that helps to check your forms
## Methods
#### $('my_form_selector').checkForm(options)
Checks form.  
**Parameters:**  
options — look to [options](#options)
#### $('my_form_selector').addInput(elem, options)
Add input in form for check. Usually it used for dynamically generated input.  
**Parameters:**  
elem — jQuery object of your input
options — look to [options](#options)
#### $('my_input_selector').checkInput()
Checks input by method that filled in attribute 'inputcheck'.
#### $('my_input_selector').changeErrorMessage(message)
Change error message (that saved in attribute 'text_error') of input.  
**Parameters:**  
message — your error message
## Options
- addHTML — HTML of your status for input.  
Default HTML is —
```
<div class = "valCheck">
	<div class="valCheckSymbol"></div>
	<div class = "valCheckText"></div>
</div>
```
## Attributes
- inputnec — defines that current input is necessary
- inputcheck — need to contain your function name and will check your input field (please note your function should be out of object i.e. "SomeObject.checkFunction")
- inputcheckajax — same as inputcheck, but use it for functions which check input by ajax i.e. usernames
- text_error — error message
- inputarg — custom argument that transfer to your function
- submitcheck — identifies your submit button  
- formcheck — identifies your form  

## Events  
#### onRightInput(func, override)  
called when user entered  correct information

#### onWrongInput(func, override)  
called when user entered wrong information

#### onRemoveStateInput(func, override)  
called when field is empty (usually after blur event or after calling method checkForm)  

##### Parameters for Events  
- func — your function.  
- override (default:**false**) — set it true, if your function need to be override default styling operations for status of input.  

## Utility methods  
#### CheckFormHelper.checkValAjax(elem, val, addHTML)  
Call it after Ajax check. For better knowledge how work with Ajax fields go   [here][#how-to-work-with-ajax-fields]  
**Parameters:**  
- elem — jQuery object of input  
- val[type: boolean] — true, if value in input correct, false, if not  
- addHTML[default: defaultHTML] — HTML for your status of input  

#### CheckFormHelper.formValid(elem)  
Call it if you want to check form.  
**Parameters:**  
- elem — jQuery object of form  

#### CheckFormHelper.defaultParameter(param, def_val)  
Checks variable, if it undefined returns def_val  
**Parameters:**  
- param — variable for check  
- def_val — default value  

#### CheckFormHelper.isUndefined(value)  
Return true if value is undefined
**Parameters:**  
- value — variable for check

## Default check function  
#### validateEmail  
Validating your e-mail field.

## How to Work With Ajax fields  
1. Set your check method in attribute 'inputcheckajax'
2. In your ajax check method after done loading data, call [CheckFormHelper.checkValAjax](#checkformhelpercheckvalajaxelem-val-addhtml) with need data
3. Viola!