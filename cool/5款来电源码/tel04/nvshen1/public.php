<?php
 //过滤字符串
 session_start();
 function slashes_str($str=null)
 {
   return htmlspecialchars(addslashes(trim($str)));
 }

 //判断手机号码
 function checkMobile($str=null)
 {
     $pattern = "/1[34578]{1}\d{9}$/";
     if (preg_match($pattern,$str))
     {
          Return true;
     }
     else
     {
         Return false;
     }
 }

  //页面跳转
  function go_url($url=null,$msg=null)
  {
	 if($msg)
	  {
	 echo "<script>alert('".$msg."')</script>";
	  }
	 echo "<script>location.href='".$url."';</script>";
  }


#curl_get
function getcontents($url){
	$ch = curl_init();
	$timeout = 5;
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
	$contents = curl_exec($ch);
	$status = curl_getinfo($ch);
	curl_close($ch);
	if($status['http_code'] == 200){
		return $contents;
	}
	return false;
}

#获取accress_token
function get_accress_token($appid,$appsecret){
//获取access_token
$url="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$appid."&secret=".$appsecret;
$no_mobile = 0;
$content = getcontents($url);
   return $content;
}

#写文件
function  write_file($file,$content)
{
      $file=fopen($file,'w');
      fwrite($file,$content);
      fclose($file);
}


#去除字符串中的所有常见特殊符号
function strFilter($str){
    $str = str_replace('`', '', $str);
    $str = str_replace('·', '', $str);
    $str = str_replace('~', '', $str);
    $str = str_replace('!', '', $str);
    $str = str_replace('！', '', $str);
    $str = str_replace('@', '', $str);
    $str = str_replace('#', '', $str);
    $str = str_replace('$', '', $str);
    $str = str_replace('￥', '', $str);
    $str = str_replace('%', '', $str);
    $str = str_replace('^', '', $str);
    $str = str_replace('……', '', $str);
    $str = str_replace('&', '', $str);
    $str = str_replace('*', '', $str);
    $str = str_replace('(', '', $str);
    $str = str_replace(')', '', $str);
    $str = str_replace('（', '', $str);
    $str = str_replace('）', '', $str);
    $str = str_replace('-', '', $str);
    $str = str_replace('_', '', $str);
    $str = str_replace('——', '', $str);
    $str = str_replace('+', '', $str);
    $str = str_replace('=', '', $str);
    $str = str_replace('|', '', $str);
    $str = str_replace('\\', '', $str);
    $str = str_replace('[', '', $str);
    $str = str_replace(']', '', $str);
    $str = str_replace('【', '', $str);
    $str = str_replace('】', '', $str);
    $str = str_replace('{', '', $str);
    $str = str_replace('}', '', $str);
    $str = str_replace(';', '', $str);
    $str = str_replace('；', '', $str);
    $str = str_replace(':', '', $str);
    $str = str_replace('：', '', $str);
    $str = str_replace('\'', '', $str);
    $str = str_replace('"', '', $str);
    $str = str_replace('“', '', $str);
    $str = str_replace('”', '', $str);
    $str = str_replace(',', '', $str);
    $str = str_replace('，', '', $str);
    $str = str_replace('<', '', $str);
    $str = str_replace('>', '', $str);
    $str = str_replace('《', '', $str);
    $str = str_replace('》', '', $str);
    $str = str_replace('.', '', $str);
    $str = str_replace('。', '', $str);
    $str = str_replace('/', '', $str);
    $str = str_replace('、', '', $str);
    $str = str_replace('?', '', $str);
    $str = str_replace('？', '', $str);
    return trim($str);
}


function nav_page($totalcounts, $address, $class="list",$pagenavpages=2) {
		global $perpage, $page;
		
		$pagenavpages = $pagenavpages;
		$totalpages = ceil($totalcounts/$perpage);

		if($totalpages <= 1) return "";

		$str_conn = strstr($address,"?")?"&":"?";
		if($class) $class = ' class="'.$class.'"';

		while($curpage++ < $totalpages) {
			if($curpage <= $page - $pagenavpages || $curpage >= $page + $pagenavpages){
				if($curpage == 1){
					$firstlink = '<a href="'.$address.$str_conn.'page='.$curpage.'" title="首页"'.$class.'>1</a>';
				}

				if($curpage == $totalpages){
					$lastlink = '<a href="'.$address.$str_conn.'page='.$curpage.'" title="末页"'.$class.'>'.$totalpages.'</a>';
				}
			}
			else{
				if($curpage == $page) $pagenav.=' <a class=pageon>'.$curpage.'</a>';
				else $pagenav .= ' <a href="'.$address.$str_conn.'page='.$curpage.'"'.$class.'>'.$curpage.'</a>';
			}
		}

		if($page > 1){
			$prevpage = $page - 1;
			$prevlink = '<a href="'.$address.$str_conn.'page='.$prevpage.'" title="上一页" class="p_redirect">上一页</a>';
			if($firstlink && $page > $pagenavpages+1) $firstlink .= " ...";
		}

		if($page < $totalpages){
			$nextpage = $page+1;
			$nextlink = '<a href="'.$address.$str_conn.'page='.$nextpage.'" title="下一页" class="p_redirect">下一页</a>';
			if($lastlink && $page < $totalpages-$pagenavpages) $lastlink = " ...".$lastlink;
		}

		$pageIput = '<input type="text" name="custompage" class="px" size="2" title="输入页码，按回车快速跳转" value="'.$_GET['page'].'" onkeydown="if(event.keyCode==13) {window.location=\'index.php?page=\'+this.value; doane(event);}">';

		$pagenav = "$prevlink $firstlink $pagenav $lastlink $nextlink ";
		if($class) $pagenav = "<span $class>$pagenav</span>";
		return $pagenav;
	}

?>