<?php 
$theFile=$_GET["loadFile"]; 
$fullName=dirname(__FILE__)."/".$theFile;
$ext=pathInfo($fullName,PATHINFO_EXTENSION);
header('Content-Disposition: attachment; filename='.$theFile.'');
if($ext==".wasm")
{
    header('Content-Type: application/wasm');
}else if($ext==".js")
{
    header('Content-Type: text/javascript');
}else
{
    header('Content-Type: text');
}
header('Content-Encoding: gzip');
header('Cache-Control: max-age=86400, public');
header('Content-Length:'.filesize($theFile.".gz"));
header('x-file-size:'.filesize($theFile));
//echo $fullName.".gz";
readfile ($theFile.".gz");
?>