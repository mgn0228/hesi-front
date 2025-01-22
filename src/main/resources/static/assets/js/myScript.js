/*──────────────────────────────────────────────
					브라우저 안쪽 높이(모바일기기포함) 구하기
───────────────────────────────────────────────*/
function setScreenSize() {
	//let vh = window.innerHeight * 0.01;
	let vh = window.innerHeight;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
}


function mobile_table_change(){
	$('.table').each(function() {
		var windowWidth = $( window ).width(),
			mobile_ui_width = $(this).attr('data-mobile-ui-width');
		if(windowWidth < mobile_ui_width) {
			$(this).addClass('mobile-ui');
		} else {
			$(this).removeClass('mobile-ui');
		}
   });
}

//화면 높이를 body에 --vh로 지정
setScreenSize();
window.addEventListener('resize', setScreenSize);


//페이지 이동시 페이드인 처리
$(window).load(function(){
	$('.fadeIn-loader').fadeOut(300);
});

$(window).resize(function() {
   mobile_table_change();
});

//document ready - start
$(document).ready(function(){

    $('body').on('click',function(e) {
        // 알람 영역이 아니거나, 알람 아이콘이 아닌 곳을 눌렀을 때
        if(!$(e.target).parents().hasClass('alarmContainer') && !$(e.target).hasClass('icon_alarm')) {
            let t = $('#topSection .alarm-wrap .alarmContainer');

            // 알람 영역이 show 상태면
            if($(t).hasClass('show')) {
                // 알람 영역을 닫아줌
                $(t).removeClass('show');
            }
        }
    })
	
	mobile_table_change();

	//좌메뉴 슬라이드 토글
	$('.sideSec-toggle').click(function() {
		$('#sideSection').toggleClass('short');
	});
	

	//알림창 열고 닫기
	$('#topSection .alarm-wrap .icon_alarm').click(function() {
		let t = $('#topSection .alarm-wrap .alarmContainer');
        if($(t).hasClass('show')) {
            $(t).removeClass('show');
        }else {
            $(t).addClass('show');
        }
	});
	$('#topSection .alarm-wrap .alarmContainer .icon_closer').click(function() {
		let t = $('#topSection .alarm-wrap .alarmContainer');
		$(t).removeClass('show');
	});

	//모바일 메뉴 열고 닫기
	$('.mobile_nav_opener').click(function() {
		$('#sideSection').addClass('show');
		$('body, html').css('overflow', 'hidden');
		$('body, html').css('background', '#f5f7f7');
	});
	$('.mobile_nav_closer').click(function() {
		$('#sideSection').removeClass('show');
		$('body, html').css('overflow', '');
		$('body, html').css('background', '');
	});
	

	
	//모바일 검색 열고 닫기
	$('.mobile_search_opener').click(function() {
		$(this).parent().toggleClass('searchOn');
		$('#topSection .searchContainer').toggleClass('show');
	});

	
	//모바일 서브메뉴 토글
	$('.sub_nav_toggle').click(function() {
		$(this).toggleClass('on');
		$(this).next('ul').slideToggle(300);
	});
	
	
	//슬라이드 토글
	$('.slide-toggle').click(function() {
		let target = $(this).attr('data-target');
		$(this).toggleClass('active');
		$(target).slideToggle(400);
	});

	//슬라이드 토글
	$('.toggleClass').click(function() {
		let target = $(this).attr('data-target');
		$(this).toggleClass('active');
		$(target).toggleClass('show');
		$('.toggleContainer').not($(target)).removeClass('show');
	});
	$('html').click(function(e) {   
		if(!$(e.target).hasClass("toggleContainer") && !$(e.target).hasClass("toggleClass")) {
			$('.toggleContainer').removeClass('show');
		}
	});
	
	
	//스크롤 위로
	$('.btnScrollTop').click(function (e) {
		e.preventDefault();
		$('html, body').animate({scrollTop: 0}, 200);
	  });


	// html 레이어 팝업 컨트롤 ──────────────────────────────────────────────────
	$('.pop-inline').click(function() {
		var target = $(this).attr('data-href');
		$(target).addClass('open');
		$('body').append('<div class="popCover"></div>');
		$('.popCover').fadeIn(300);
		if($(target).find('.pop-closer, .popClose').length==0) {
			$(target).prepend('<span class="pop-closer">팝업닫기</span>');
		}
		$('body, html').css('overflow', 'hidden');
		click_popClose();		
	});
	click_popClose();



	$(document).on('click', '.popClose', function (e) {
		e.preventDefault();
		//$.magnificPopup.close();
	});
	$('.myClick').click();


});
//document ready - end





function click_popClose(){
	$('.pop-closer, .layer-popup .popClose, .pop-bg').click(function() {
		var el = $(this).closest('.layer-popup');
		el.removeClass('open');
		$('.popCover').remove();
		$('body, html').css('overflow', '');
	});
}