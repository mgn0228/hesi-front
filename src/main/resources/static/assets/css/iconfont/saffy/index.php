<?php 
function get_url( $url ) {
	$url .= "?ver=".date("Ymdhis",filemtime($url)); 
    return $url;
}
?>
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <title>saffy 폰트</title>
	<link rel="stylesheet" href="<?=get_url('./style.css')?>">
	<link rel="stylesheet" href="<?=get_url('./css/bootstrap-select.css')?>">
	<link rel="stylesheet" href="<?=get_url('./index.css')?>">
    
    

	<link href="http://fonts.googleapis.com/earlyaccess/nanumgothic.css" rel="stylesheet" type="text/css">
	<link rel="shortcut icon" href="favorite.png">
  </head>
  <body>

<script src="js/clipboard/clipboard.min.js"></script>
<script>
var clipboard = new ClipboardJS('.all-icons span',{
	text: function(trigger) {
		return trigger.innerText;
    }
});
/*var clipboard = new ClipboardJS('.all-icons li',{
	text: function(trigger) {
		return trigger.getAttribute('.code').innerText;
    }
});*/
clipboard.on('success', function(e) { console.log(e); });
clipboard.on('error', function(e) { console.log(e); });
</script>


<section id="font_options_bar">
	<nav id="nav">
		<div class="container">
			<div class="size_select">
				<select class="selectpicker">
				<option>free</option>
				<option value="11">11</option>
				<option value="12">12</option>
				<option value="13">13</option>
				<option value="14">14</option>
				<option value="16">16</option>
				<option value="18">18</option>
				<option value="20">20</option>
				<option value="22">22</option>
				<option value="32">32</option>
				<option value="48">48</option>
				<option value="64">64</option>
				<option value="80">80</option>
				<option value="96">96</option>
				<option value="112">112</option>
				<option value="128">128</option>
				</select>
			</div>
		</ul>
		<span class="bg-switch pull-right">
			<input id="s1" type="checkbox" class="sw">
			<label for="s1" class="switch"><span class="bg_circle"></span></label>
		</span>
	</nav>
</section>


<div class="all-icons">

	<ul style="margin-top:50px"><!--/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->


<li><i class="saffy-acdex"></i><span class="code">e940</span></li>
<li><i class="saffy-activity"></i><span class="code">e900</span></li>
<li><i class="saffy-alert-circle"></i><span class="code">e901</span></li>
<li><i class="saffy-alert-octagon"></i><span class="code">e902</span></li>
<li><i class="saffy-alert-triangle"></i><span class="code">e903</span></li>
<li><i class="saffy-arrow-down"></i><span class="code">e904</span></li>
<li><i class="saffy-bell"></i><span class="code">e905</span></li>
<li><i class="saffy-book"></i><span class="code">e906</span></li>
<li><i class="saffy-book-open"></i><span class="code">e941</span></li>
<li><i class="saffy-bookmark"></i><span class="code">e942</span></li>
<li><i class="saffy-box"></i><span class="code">e943</span></li>
<li><i class="saffy-calendar"></i><span class="code">e907</span></li>
<li><i class="saffy-camera"></i><span class="code">e908</span></li>
<li><i class="saffy-check"></i><span class="code">e909</span></li>
<li><i class="saffy-check-circle"></i><span class="code">e944</span></li>
<li><i class="saffy-check-square"></i><span class="code">e90a</span></li>
<li><i class="saffy-chevron-left"></i><span class="code">e90b</span></li>
<li><i class="saffy-chevron-right"></i><span class="code">e90c</span></li>
<li><i class="saffy-chevrons-left"></i><span class="code">e90d</span></li>
<li><i class="saffy-chevrons-right"></i><span class="code">e90e</span></li>
<li><i class="saffy-clipboard"></i><span class="code">e90f</span></li>
<li><i class="saffy-clock"></i><span class="code">e910</span></li>
<li><i class="saffy-command"></i><span class="code">e945</span></li>
<li><i class="saffy-copy"></i><span class="code">e911</span></li>
<li><i class="saffy-corner-down-right"></i><span class="code">e912</span></li>
<li><i class="saffy-corner-left-down"></i><span class="code">e946</span></li>
<li><i class="saffy-credit-card"></i><span class="code">e913</span></li>
<li><i class="saffy-database"></i><span class="code">e914</span></li>
<li><i class="saffy-delete"></i><span class="code">e915</span></li>
<li><i class="saffy-download"></i><span class="code">e916</span></li>
<li><i class="saffy-droplet"></i><span class="code">e947</span></li>
<li><i class="saffy-edit"></i><span class="code">e917</span></li>
<li><i class="saffy-edit-2"></i><span class="code">e948</span></li>
<li><i class="saffy-edit-3"></i><span class="code">e918</span></li>
<li><i class="saffy-external-link"></i><span class="code">e919</span></li>
<li><i class="saffy-eye"></i><span class="code">e91a</span></li>
<li><i class="saffy-file"></i><span class="code">e91b</span></li>
<li><i class="saffy-file-copy"></i><span class="code">e95d</span></li>
<li><i class="saffy-file-minus"></i><span class="code">e91c</span></li>
<li><i class="saffy-file-plus"></i><span class="code">e91d</span></li>
<li><i class="saffy-file-text"></i><span class="code">e91e</span></li>
<li><i class="saffy-filter"></i><span class="code">e91f</span></li>
<li><i class="saffy-folder"></i><span class="code">e920</span></li>
<li><i class="saffy-folder-minus"></i><span class="code">e921</span></li>
<li><i class="saffy-folder-plus"></i><span class="code">e922</span></li>
<li><i class="saffy-grid"></i><span class="code">e923</span></li>
<li><i class="saffy-hard-drive"></i><span class="code">e924</span></li>
<li><i class="saffy-headphones"></i><span class="code">e925</span></li>
<li><i class="saffy-hexagon"></i><span class="code">e926</span></li>
<li><i class="saffy-home"></i><span class="code">e949</span></li>
<li><i class="saffy-inbox"></i><span class="code">e927</span></li>
<li><i class="saffy-info"></i><span class="code">e94a</span></li>
<li><i class="saffy-layers"></i><span class="code">e928</span></li>
<li><i class="saffy-layout"></i><span class="code">e929</span></li>
<li><i class="saffy-link-2"></i><span class="code">e92a</span></li>
<li><i class="saffy-list"></i><span class="code">e92b</span></li>
<li><i class="saffy-lock"></i><span class="code">e92c</span></li>
<li><i class="saffy-log-in"></i><span class="code">e94b</span></li>
<li><i class="saffy-log-out"></i><span class="code">e94c</span></li>
<li><i class="saffy-mail"></i><span class="code">e94d</span></li>
<li><i class="saffy-map"></i><span class="code">e94e</span></li>
<li><i class="saffy-map-pin"></i><span class="code">e92d</span></li>
<li><i class="saffy-menu"></i><span class="code">e92e</span></li>
<li><i class="saffy-message-circle"></i><span class="code">e94f</span></li>
<li><i class="saffy-message-square"></i><span class="code">e92f</span></li>
<li><i class="saffy-minus"></i><span class="code">e950</span></li>
<li><i class="saffy-monitor"></i><span class="code">e951</span></li>
<li><i class="saffy-more-horizontal"></i><span class="code">e952</span></li>
<li><i class="saffy-more-vertical"></i><span class="code">e930</span></li>
<li><i class="saffy-paperclip"></i><span class="code">e953</span></li>
<li><i class="saffy-phone"></i><span class="code">e931</span></li>
<li><i class="saffy-plus"></i><span class="code">e932</span></li>
<li><i class="saffy-pocket"></i><span class="code">e933</span></li>
<li><i class="saffy-printer"></i><span class="code">e954</span></li>
<li><i class="saffy-refresh-ccw"></i><span class="code">e955</span></li>
<li><i class="saffy-rotate-ccw"></i><span class="code">e934</span></li>
<li><i class="saffy-save"></i><span class="code">e956</span></li>
<li><i class="saffy-search"></i><span class="code">e935</span></li>
<li><i class="saffy-send"></i><span class="code">e936</span></li>
<li><i class="saffy-settings"></i><span class="code">e937</span></li>
<li><i class="saffy-share-2"></i><span class="code">e938</span></li>
<li><i class="saffy-shield"></i><span class="code">e939</span></li>
<li><i class="saffy-shield-off"></i><span class="code">e93a</span></li>
<li><i class="saffy-sidebar"></i><span class="code">e957</span></li>
<li><i class="saffy-tag"></i><span class="code">e958</span></li>
<li><i class="saffy-trash-2"></i><span class="code">e93b</span></li>
<li><i class="saffy-trello"></i><span class="code">e959</span></li>
<li><i class="saffy-unlock"></i><span class="code">e95a</span></li>
<li><i class="saffy-user"></i><span class="code">e93c</span></li>
<li><i class="saffy-user-check"></i><span class="code">e93d</span></li>
<li><i class="saffy-user-plus"></i><span class="code">e95b</span></li>
<li><i class="saffy-users"></i><span class="code">e95c</span></li>
<li><i class="saffy-x"></i><span class="code">e93e</span></li>
<li><i class="saffy-youtube"></i><span class="code">e93f</span></li>
	
	</ul>

</div>


<!-- Scripts -->
<script type="text/javascript" src="js/lib/jquery-1.11.1.min.js"></script>
<script type="text/javascript" src="js/lib/bootstrap.min.js"></script>
<script type="text/javascript" src="js/lib/bootstrap-select.min.js"></script>
<script type="text/javascript" src="<?=get_url('js/lib/main.js')?>"></script>

<script>
$('li i').each(function() {
	var thisClass = $(this).attr('class');
	//var thisText = $(this).data('text');
	//$(this).after('<span class="name">' + thisClass + '</span>');
});
$('span.code').each(function() {
	var thisText = $(this).text();
	$(this).after('<span class="unicode">&amp;#x' + thisText + '</span>');
});
</script>
</body>
</html>