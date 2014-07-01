<?php

// Detect browser language
if ( $_POST['lang'] != '' ) {
	$browser_lang = $_POST['lang'];
} else {
	$browser_lang = explode(',',$_SERVER['HTTP_ACCEPT_LANGUAGE']);
	$browser_lang = strtolower(substr(chop($browser_lang[0]),0,2));
}

// Set a due date for the answer (the day after tomorrow)
date_default_timezone_set('Europe/Rome');
$answer_due_date = date('l', strtotime("+2 day"));

if ( $_POST ) {
	$errors = false;
	
	if ( $_POST['name'] != '' ) {
		$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
		if ( $name == '' ) {
			$errors .= $errors_msgs['nameinvalid'];
		}
	} else {
		$errors .= $errors_msgs['nameinvalid'];
	}
	
	if ( $_POST['website'] != '' ) {
		$url = $_POST['website'];
		$parts = parse_url($url);
		if ( !isset($parts["scheme"]) )
			{
				$url = "http://$url";
			}
		$website = filter_var($url, FILTER_SANITIZE_URL);
		if ( $website == '' ) {
			$website .= $errors_msgs['websiteempty'];
		}
	} else {
		$website = 'Not specified';
	}
	
	if ( $_POST['email'] != '' ) {
		$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
		if ( !filter_var($email, FILTER_VALIDATE_EMAIL) ) {
			$errors .= $email . $errors_msgs['emailinvalid'];
		}
	} else {
		$errors .= $errors_msgs['emailempty'];
	}
	
	if ( $_POST['message'] != '' ) {
		$message = htmlentities( strip_tags( filter_var($_POST['message'], FILTER_SANITIZE_STRING) ) ) ;
		if ( $message == '' ) {
			$message = 'Messaggio vuoto';
		}
	} else {
		$message = 'Messaggio vuoto';
	}
	
	// validate, sanitize and format the date
	if ( $_POST['date'] != '' ) {
		$months = ['00', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		
		$original_date = filter_var($_POST['date'], FILTER_SANITIZE_STRING);
		$date = date_parse($original_date);
		
		if ($date['error_count'] == 0 && checkdate($date['month'], $date['day'], $date['year'])) {
			$date_string = $months[$date['month']] .' '. $date['year'];
		} elseif ( $date == '' ) {
			$date = 'Not specified';
		} else {
			$date_string = $original_date;
		}
	}
	
	if ($_POST['budget'] != '') {
		$budget = filter_var($_POST['budget'], FILTER_SANITIZE_NUMBER_INT);
	}
		
	if (isset($_POST['services'])) {
		if ( $_POST['services'] != '' ) {
			$services_arr = array();
			foreach ($_POST['services'] as $chiave => $valore) {
				
				switch ($valore) {
					case 'website-serv':
						$services_arr[] = 'a website';
						break;
					case 'ecommerce':
						$services_arr[] = 'an e-commerce website';
						break;
					case 'photo':
						$services_arr[] = 'a photo shooting';
						break;
					case 'corporate':
						$services_arr[] = 'a corporate identity design';
						break;
					case 'social':
						$services_arr[] = 'a social media marketing campaign';
						break;
					case 'seo':
						$services_arr[] = 'a search engine optimization service';
						break;
					case 'print':
						$services_arr[] = 'a print advertising design';
						break;
					default:
						$services_arr[] = 'this voice is not permitted';
				}
			}
			$services = implode(', ', $services_arr);
		}
	} else {
		$services = 'no service selected';
	}
	
	// SET MESSAGES
	// errors messages
	$errors_it = [
		'nameinvalid'	=>	'Per favore inserisci un nome valido.<br><br>',
		'emailinvalid'	=>	' <strong>NON</strong> è un indirizzo email valido.<br><br>',
		'emailempty'	=>	'Per favore, inserisci un indirizzo email.<br><br>'
	];
	$errors_en = [
		'nameinvalid'	=>	'Please, insert a valid name.<br><br>',
		'emailinvalid'	=>	' is <strong>NOT</strong> a valid email address.<br><br>',
		'emailempty'	=>	'Please, insert a valid email.<br><br>'
	];
	
	// success messages
	$success_it = [
		'thanks'	=>	'Grazie!',
		'hi'		=>	'Ciao',
		'txt'		=>	'Grazie per averci contattato. Ti risponderemo al più presto all\'indirizzo '
	];
	$success_en = [
		'thanks'	=>	'Thanks!',
		'hi'		=>	'<p>Hi, '. $name .'!</p>',
		'txt'		=>	'<p>We are very pleased to hear from you. At this time we should have already received your message. We will discuss it internally and prepare some notes for the initial briefing with you.</p>
		<p>We will answer within '. $answer_due_date .' at '. $email .'.</p>'
	];
	
	// mail texts
	$mail_it = [
		'subject'	=>	'Grazie per averci contattato',
		'greeting'	=>	'<html><head><meta charset="utf-8"></head><body>Ciao ',
		'body'		=>	'test ita</body></html>',
	];
	$mail_en = [
		'subject'	=>	'Thanks for getting in touch',
		'greeting'	=>	'<html><head><meta charset="utf-8"></head><body>Hi ',
		'body'		=>	'test eng</body></html>',
	];
	
	switch ( $browser_lang ) {
		case 'it':
			$errors_msgs = $errors_it;
			$success_msgs = $success_it;
			$email_txts = $mail_it;
			break;
		default:
			$errors_msgs = $errors_en;
			$success_msgs = $success_en;
			$email_txts = $mail_en;
	}
	
	// FIRE THE ACTUAL THING
	if ( !$errors ) {
		$admin = 'HelloGravida<hello@gravida.pro>';
		$subject = 'Everybody wants Gravida';
		$headers_notif = 'From: Gravida<hello@gravida.pro>' . "\r\n" .
					'Reply-To: Gravida<hello@gravida.pro>' . "\r\n" .
					'MIME-Version: 1.0' . "\r\n" .
					'Content-Type: text/html; charset=utf-8' . "\r\n";
		$thank_you = $email_txts['greeting'] . $name .'!<br><br>'. $email_txts['body'];
		
		// This is sent to the admin
		@include('email/notif-template.php');
		mail($admin, $subject, $notif_body, $headers_notif);
		
		// This is sent to who has submitted the form
		$headers_response = 'From: Gravida<hello@gravida.pro>' . "\r\n" .
					'Reply-To: Gravida<hello@gravida.pro>' . "\r\n" .
					'MIME-Version: 1.0' . "\r\n" .
					'Content-Type: text/html; charset=utf-8' . "\r\n";
		
		@include('email/response-template.php');
		mail($email, $email_txts['subject'], $response_body, $headers_response);
		
		echo '<div class="form-success">
				<h1 class="animate-fade">'. $success_msgs['thanks'] .'</h1>
				'. $success_msgs['hi'] . $success_msgs['txt'] .'
			</div>';
	} else {
		echo '<div style="color: red">'. $errors .'<br/></div>';
	}
	
}

?>