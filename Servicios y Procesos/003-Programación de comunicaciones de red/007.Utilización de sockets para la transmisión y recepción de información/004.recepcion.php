<?php

$hostname = '{imap.ionoses:993/imap/ssl}INBOX';
$username = 'dam@jocarsa.com';
$password = 'TAME123$'

$inbox = imap_open($hostname, $username, $password) or die('No se puede conectar al servidor imap'.imap_last_error());
$emails = imap_search($inbox, 'ALL');

if ($emails){
    rsort($emails);
    foreach($emails as $email_number){
        $overview = imap_fetch_overview($inbox, $email_number,0);
        $messsage = imap_fetchbody($inbox, $email_number, 1);

        echo 'Subject'.$overview[0]->subject. "<br>";
        echo 'From'.$overview[0]->from. "<br>";
        echo 'Message'.$message. "<br>";
    }
}
imap_close($inbox);
?>