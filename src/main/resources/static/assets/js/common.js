
//엘리먼트 온ㆍ오프 //match값은 ,구분 여러개 가능
function matchOnOff(elm, match, target) {
	var val = $(elm + ':checked').val();
	var arrMatch = match.split(",");
	$(target).hide();
	for(var i in arrMatch) {
		if(val == arrMatch[i]) {		
			$(target).show();	
		}
	}
	$(elm).change(function (){
		var val = $(this).val();
		$(target).hide();
		for(var i in arrMatch) {
			if(val == arrMatch[i]) {		
				$(target).show();	
			}
		}
	});
}



//클릭하여 엘리먼트 온
function matchOn(opener, target, closer) {	
	if(opener == closer) {
		$(opener).click(function() {
			$(target).toggle();		
		});
	} else {
		$(opener).click(function() {
			$(target).show();		
		});
		$(closer).click(function() {
			if(opener != closer)
				$(target).hide();
		});
	}
}


//엘리먼트오프 //match값은 ,구분 여러개 가능
function matchOff(elm, match, target) {
	var val = $(elm).val();
	var arrMatch = match.split(",");
	for(var i in arrMatch) {
		if(val == arrMatch[i]) {
			$(target).hide();			
		}
	}
	$(elm).change(function (){
		var val = $(this).val();
		for(var i in arrMatch) {
			if(val == arrMatch[i]) {		
				$(target).hide();		
			}
		}
	});
}


//slide toggle
function slide_toggle(elm, target, start) {
	if(start != 'open') {
		$(target).css({'display':'none'});
	}
	$(elm).click(function() {
		$(target).slideToggle(300, 'easeInOutExpo', function() {
		});
		$(target).toggleClass('open');
	});
}


//document ready - start
$(document).ready(function(){
	
	
	//토글 버튼
	$('.toggle-btn').click(function() {
		$(this).toggleClass('on');
		var container = $(this).parent().find('.toggle-container');
		container.toggleClass('open');
	});

	//테이블 tr또는 td에 링크..
	$('.tr-link, .td-link').click(function() {
		var url = $(this).attr('data-link');
		if($(this).hasClass('blank')) {
			window.open(url,' _blank'); //새창이동
		} else {
			location.href=url; //페이지 이동
		}		
	});


	//외부 팝업 
	$('.popWin').click(function(event){
		var href = $(this).attr('href'),
		winWidth = $(this).attr('data-width'),
		winHeight = $(this).attr('data-height'),
		board = $(this).attr('title'),
		data_top = $(this).attr('data-top'),
		data_left = $(this).attr('data-left');

		if(typeof data_top !== typeof undefined && data_top !== false && data_top)
			var top = $(this).attr('data-top');
		else
			var top = Math.ceil((window.screen.height - winHeight)/2);
		
		if(typeof data_left !== typeof undefined && data_left !== false && data_left)
			var left = $(this).attr('data-left');
		else
			var left = Math.ceil((window.screen.width - winWidth)/2);

		window.open(href,board,'width='+winWidth+',height='+winHeight+',top='+top+',left='+left+',scrollbars=yes, toolbar=no, menubar=no, location=no, statusbar=no, status=no, resizable=yes');
		event.preventDefault();
	});


	//시스템 엘럿메시지
	$('.alert').click(function() {
        var msg = $(this).attr('data-msg');
		var replace_result = msg.replace(/(<br>|<br\/>|<br \/>)/g, '\r\n');
		if(confirm(replace_result)) {
		} else {
			return false;
		}
    });


	// html 엘럿메시지 팝업 ──────────────────────────────────────────────────────
	$('.pop-alert').click(function() {
		let text = $(this).attr('data-text');
		popup_alert(text);
	});
	

	


});
//document ready - end







/*───────────────────────────────────────────────────────────
													엘럿메시지 팝업
───────────────────────────────────────────────────────────*/
function popup_alert(text, url) {
	let pop_alert_closer = url ? '<a href="'+url+'" class="pop_alert_closer">확인</a>' : '<span class="pop_alert_closer">확인</span>';
	let pop_alertContainer = '<div id="pop_alertContainer">';
		pop_alertContainer += '<div class="pop-inner">';
		pop_alertContainer += text;
		pop_alertContainer += '<div class="pop_btnSet">'+pop_alert_closer+'</div>';
		pop_alertContainer += '</div>';
		pop_alertContainer += '<div class="pop-bg"></div>';			
		pop_alertContainer += '</div>';
	$('body').prepend(pop_alertContainer);
	$('body, html').css('overflow', 'hidden');
	$('.pop_alert_closer').click(function() {
		$('#pop_alertContainer').remove();
		$('body, html').css('overflow', '');
	});
}