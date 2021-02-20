<?php
header("Cache-Control: no-cache");
$dir = opendir(".");
clearstatcache();
$theTime=$_GET["timestamp"]; 
$yesdate =$theTime;
$firstTime=true;
$nowTime=0;
echo "{\"updated_files\":[";
while(false != ($file = readdir($dir)))
{
    if($file=='.' || $file=='..')continue;
    $modTime=filemtime($file);
    if ($modTime > $yesdate)
    {
        if(!$firstTime)
        {
            echo ",";
        }
        $firstTime=false;
        echo "\"${file}\"";        
    }
    if($modTime>$nowTime)
    {
        $nowTime=$modTime;
    }
}
echo "],\"time_now\":\"${nowTime}\"";
echo "}";

?>
