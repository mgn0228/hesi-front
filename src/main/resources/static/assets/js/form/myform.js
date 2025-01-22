
function btnSubmit_active(el) {
	$(el).addClass('active');
}
function btnSubmit_cancel(el) {
	$(el).removeClass('active');
}

$(document).ready(function(){

	//input label ──────────────────────────────────────────
	$('input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="range"])').each(function() {
		var label =  typeof $(this).attr('data-label') !== typeof undefined && $(this).attr('data-label') !== '' ? $(this).attr('data-label') : '',
			label_right =  typeof $(this).attr('data-label-right') !== typeof undefined && $(this).attr('data-label-right') !== '' ? $(this).attr('data-label-right') : '',
			label_inline =  typeof $(this).attr('data-label-inline') !== typeof undefined && $(this).attr('data-label-inline') !== '' ? $(this).attr('data-label-inline') : '',
			label_id =  typeof $(this).attr('data-id') !== typeof undefined && $(this).attr('data-id') !== '' ? $(this).attr('data-id') : '',
			thisClass = typeof $(this).attr('data-class') !== typeof undefined && $(this).attr('data-class') !== '' ? ' ' + $(this).attr('data-class') : '';

		if(label || label_right || label_inline) {
			var label_id = label_id ? 'id="' + label_id + '"' : '';
			if(!$(this).closest('.labelInput').length) {
				$(this).wrap('<label ' + label_id + ' class="labelInput' + thisClass + '"></label>');
			} else {
				$(this).closest('.labelInput').addClass(thisClass);
			}
			if(label) $(this).before('<span class="label">' + label + '</span>');
			if(label_right) $(this).after('<span class="label">' + label_right + '</span>');
			if(label_inline) {
				$(this).after('<span class="label-inline">' + label_inline + '</span>');
				var labelWidth = $(this).next('.label-inline').outerWidth();
				$(this).css({"padding-right":labelWidth});
			}
			if($(this).hasClass('w-full')) {
				$(this).parent('.labelInput').addClass('w-full');
			}			
		}
	});	

	$('.labelInput input').blur(function() {
		$(this).parent().removeClass("focus");
	}).focus(function() {
		$(this).parent().addClass("focus");
	});

	$('select').each(function() {
		var label =  typeof $(this).attr('data-label') !== typeof undefined && $(this).attr('data-label') !== '' ? $(this).attr('data-label') : '',
			label_right =  typeof $(this).attr('data-label-right') !== typeof undefined && $(this).attr('data-label-right') !== '' ? $(this).attr('data-label-right') : '',
			label_id =  typeof $(this).attr('data-id') !== typeof undefined && $(this).attr('data-id') !== '' ? 'id="'+$(this).attr('data-id')+'" ' : '',
			thisClass = typeof $(this).attr('data-class') !== typeof undefined && $(this).attr('data-class') !== '' ? ' ' + $(this).attr('data-class') : '';
		var $select = $(this).parent('.bootstrap-select').length ? $(this).parent('.bootstrap-select') : $(this);

		if(label || label_right || label_id) {
			if(!$(this).closest('.labelInput').length) {
				$select.wrap('<label class="labelInput labelSelect' + thisClass + '"></label>');				
			} else {
				$select.closest('.labelInput').addClass(thisClass);
			}
		}
		if(label) {
			$select.before('<span class="label">' + label + '</span>');
		}
		if(label_right) {
			$select.after('<span class="label">' + label_right + '</span>');
		}
	});


	// checkbox ──────────────────────────────────────────
	$('input[type="checkbox"]').each(function() {
		var wrap = $(this).parent('label'),
			thisClass = typeof $(this).attr('data-class') !== typeof undefined && $(this).attr('data-class') !== '' ? $(this).attr('data-class') : '';

		if($(this).hasClass('circle')) thisClass += ' circle';
		if($(this).hasClass('line')) thisClass += ' line';
		if($(this).hasClass('button')) thisClass += ' button';
		
		
		if($(this).hasClass('toggle-light')) {
			var label_on = typeof $(this).attr('data-on') !== typeof undefined && $(this).attr('data-on') !== '' ? $(this).attr('data-on') : '';
				label_off = typeof $(this).attr('data-off') !== typeof undefined && $(this).attr('data-off') !== '' ? $(this).attr('data-off') : '';
			$(this).removeClass('toggle-light');
			if(wrap.length == 0) {
				$(this).wrap('<label class="toggle-light '+thisClass+'"></label>');
			}
			if($(this).next('span').length == 0) {
				$(this).after('<span class="bg-circle"></span><span class="labelOn">' + label_on + '</span><span class="labelOff">' + label_off + '</span>');
			}
		} else {
			var label = typeof $(this).attr('data-label') !== typeof undefined && $(this).attr('data-label') !== '' ? $(this).attr('data-label') : '';
			if(wrap.length == 0) {
				$(this).wrap('<label class="checkbox-wrap"></label>');
			} else {
				wrap.addClass('checkbox-wrap');
			}
			if($(this).next('span').length == 0) {
				if($(this).hasClass('button')) {
					$(this).after('<span>' + label + '</span>');
				} else {
					$(this).after('<span></span>' + label);
				}
			}
		}
		if(thisClass) $(this).parent('.checkbox-wrap').addClass(thisClass);
	});
	
	// radio ──────────────────────────────────────────
	$('input[type="radio"]').each(function() {		
		var wrap = $(this).parent('label'),
			thisClass = typeof $(this).attr('data-class') !== typeof undefined && $(this).attr('data-class') !== '' ? $(this).attr('data-class') : '',
			label = typeof $(this).attr('data-label') !== typeof undefined && $(this).attr('data-label') !== '' ? $(this).attr('data-label') : '';

		if($(this).hasClass('circle')) thisClass += ' circle';
		if($(this).hasClass('line')) thisClass += ' line';
		if($(this).hasClass('button')) thisClass += ' button';
		if($(this).hasClass('radio-btn')) thisClass += ' radio-btn';
		
		if(wrap.length == 0) {
			$(this).wrap('<label class="radio-wrap"></label>');
		} else {
			wrap.addClass('radio-wrap');
		}

		if($(this).hasClass('radio-btn') || $(this).hasClass('button')) {
			if($(this).next('span').length == 0) {
				$(this).after('<span>' + label + '</span>');
			}
			$(this).removeClass('radio-btn');
			$(this).removeClass('button');
		} else {
			if($(this).next('span').length == 0) {
				$(this).after('<span></span>' + label);
			}
		}
		if(thisClass) $(this).parent('.radio-wrap').addClass(thisClass);
	});
	
	
	//모두선택 (채크박스) ──────────────────────────────────────────
	$('.chkall').each(function() {
		let chkall = $(this);
		let chk_name = chkall.attr('data-group');
		let chk = $('.' + chk_name);
		let btnsubmit = chkall.attr('data-active-btn');
		chkall.click(function() {
			if(chkall.is(":checked")) {
				chk.prop("checked", true);
				if(btnsubmit)
					btnSubmit_active(btnsubmit);
			} else {
				chk.prop("checked", false);
				if(btnsubmit)
					btnSubmit_cancel(btnsubmit);
			}
		});
		chk.click(function() {
			let total = chk.length;
			let checked = $('.' + chk_name + ':checked').length;
			
			if(total != checked) {
				chkall.prop("checked", false);
				if(btnsubmit)
					btnSubmit_cancel(btnsubmit);
			} else {
				chkall.prop("checked", true);
				if(btnsubmit)
					btnSubmit_active(btnsubmit);
			}
		});
	});

	// datepicker ──────────────────────────────────────────
	$('input.datepicker').each(function() {
		var wrap = $(this).parent('label');
		if(wrap.length == 0) {
			$(this).wrap('<label class="datepicker-wrap"></label>');
			$(this).before('<span class="icon_datepicker"></span>');
		}		
		var is_autoPick = typeof $(this).attr('placeholder') !== typeof undefined && $(this).attr('placeholder') !== '' ? false : true;		
		$(this).datepicker({
			language: 'ko-KR',
			autoPick: is_autoPick,
			format: 'yyyy-mm-dd'
        });
	});

    $('input.datepicker').on('change',function() {
        $(this).datepicker( "hide" );
    })
	
	// 숫자만 입력 ──────────────────────────────────────────
	$("input.number").bind("keyup", function() {
		$(this).val($(this).val().replace(/[^0-9]/g,""));
	});

	// 휴대폰 번호 입력 ──────────────────────────────────────────
	function phoneFomatter(num,type) {
		var formatNum = '';
		if(num.length==11) {
			if(type==0) {
				formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
			} else {
				formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
			}
		} else if(num.length==8) {
			formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
		} else {
			if(num.indexOf('02')==0) {
				if(type==0) {
					formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
				} else {
					formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
				}
			} else {
				if(type==0){
					formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
				} else {
					formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
				}
			}
		}
		return formatNum;
	}
	$("input.phone").bind("keyup", function(event) {
		$(this).val(phoneFomatter($(this).val().replace(/[^0-9]/g,"")));
	});


	// 날짜 입력 ──────────────────────────────────────────
	function dateFomatter(num,type) {
		var formatNum = '';
		formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');		

		return formatNum;
	}
	$("input.timer_date").bind("keyup", function(event) {
		$(this).val(dateFomatter($(this).val().replace(/[^0-9]/g,"")));
	});


	// 시간 입력 ──────────────────────────────────────────
	function timeFomatter(num,type) {
		var formatNum = '';
		formatNum = num.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');		

		return formatNum;
	}
	$("input.timer_time").bind("keyup", function(event) {
		$(this).val(timeFomatter($(this).val().replace(/[^0-9]/g,"")));
	});

	// PX or % 단위 자동변경 ──────────────────────────────────────────
	$('input.percent, input.per100').each( function() {
		var thisValue = $(this).val();
		var label = $(this).next('span');
		if(thisValue <= 100 && thisValue > 0) {
			label.html('%');
		} else {
			label.html('PX');
		}		
	});
	$('input.percent, input.per100').bind("keyup", function(event) {
		var thisValue = $(this).val();
		var label = $(this).next('span');
		if(thisValue <= 100 && thisValue > 0) {
			label.html('%');
		} else {
			label.html('PX');
		}
	});

	// PX or % 단위 자동변경 ──────────────────────────────────────────
	$('input.textlength').each( function() {
		var thisValue = $(this).val();
		var label = $(this).next('span');
		if(thisValue == 1) {
			label.html('줄 자르기');
		} else {
			label.html('글자');
		}		
	});
	$('input.textlength').bind("keyup", function(event) {
		var thisValue = $(this).val();
		var label = $(this).next('span');
		if(thisValue == 1) {
			label.html('줄 자르기');
		} else {
			label.html('글자');
		}
	});
	
	// textarea 자동조절 ──────────────────────────────────────────
	function textareaResize(obj) {
		obj.style.height = "1px";
		obj.style.height = (2+obj.scrollHeight)+"px";
	}
	$("textarea.autosize").bind("keypress", function(event) {
		textareaResize(this);
	});
	$("textarea.autosize").bind("keyup", function(event) {
		textareaResize(this);
	});
	$('textarea.autosize').each( function() {
		textareaResize(this);
	});
	
	

	
	
	// 글자수 제한 ──────────────────────────────────────────
	$('.limited').keyup(function () {
		let content = $(this).val();
		let max = $(this).attr('data-maxlength');
		if (content.length == 0 || content == '') {
			$('.textCount').text('0');
		} else {
			$('.textCount').text(content.length);
		}
		if (content.length > max) {			
			$(this).val($(this).val().substring(0, max));
			alert('글자수는 ' + max + '자까지 입력 가능합니다.');
		};
	});




	
	// 이메일 유효성 채크 ──────────────────────────────────────────
	function email_check( email ) {
		let regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		return (email != '' && email != 'undefined' && regex.test(email)); 
	}
	function emailCheck(el) {
		let email = el.val();
		if( email == '' || email == 'undefined') {
			$(".emailCheck-msg").text('').removeClass('checked');
			return;
		}
		if(! email_check(email) ) {
			$(".emailCheck-msg").text('※ 이메일 형식으로 적어주세요').removeClass('checked');
			$(this).focus();
			return false;
		} else {
			$(".emailCheck-msg").text('').addClass('checked');
		}
	}
	emailCheck($('input.emailCheck'));
	//$("input.emailCheck").blur(function(){
	$("input.emailCheck").bind("keyup", function(event) {
		emailCheck($(this));
	});



	// file ──────────────────────────────────────────
	// 업로드 이미지 미리보기
	$('input[type="file"].img').each(function(index) {
		var inp = $(this);
		var upload = $(this)[0];
		$(this).parent().parent().find('.upImg-preview').attr('id', 'holder_' + index);
		var holder = document.getElementById('holder_' + index);

		$(this).on('change', function(){ // 값이 변경되면
			if(window.FileReader){ // modern browser
				var filename = $(this)[0].files[0].name;
			} else { // old IE
				var filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출
			} // 추출한 파일명 삽입
			$(this).siblings('.upload-name').val(filename);
		});


		upload.onchange = function (e) {
			e.preventDefault();
			var file = upload.files[0],
			reader = new FileReader();
			reader.onload = function (event) {
				var img = new Image();
				img.src = event.target.result;
				//btn.hide();
				//holder.children('img').remove();
				if(inp.hasClass('multiple')) {
				} else {
					holder.innerHTML = '';		
				}
				holder.appendChild(img);
				//$(holder).css('background-image', 'url("' + reader.result + '")'); //background로 추출
			};			
			reader.readAsDataURL(file);			
			return false;
		};
	});


	$('.rangeContainer').each(function() {
		var slider = $(this).find("input"),
			fill = $(this).find(".range-track-fill");
			val = slider.val(),
			per = Math.floor((100 / (slider.attr('max') - slider.attr('min'))) * (val - 1));
		fill.css({'width':per + '%'});

		slider.on('input', function() {
		//slider.change(function (){
			var val = $(this).val(),
				per = Math.floor((100 / (slider.attr('max') - slider.attr('min'))) * (val - 1));
			fill.css({'width':per + '%'});
		});		
	});

	
	//수량 증가/감소
	$('.count-wrap :button').on({
		'click' : function(e){
			e.preventDefault();
			var $count = $(this).parent('.count-wrap').find('input');
			var now = parseInt($count.val());
			var min = 0;
			var max = 999;
			var num = now;
			if($(this).hasClass('minus')){
				var type = 'm';
			} else {
				var type = 'p';
			}
			if(type=='m'){
				if(now>min){
					num = now - 1;
				}
			}else{
				if(now<max){
					num = now + 1;
				}
			}
			if(num != now){
				$count.val(num);
			}
		}
	});

});



