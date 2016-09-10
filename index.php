<!doctype html>
<html>
<head>
  <title>Заклинания</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <link rel="stylesheet" type="text/css" href="css/style.css">
  <meta name="description" content="Заклинания ДнД 5"> 
    <link href="http://youknowwho.ru/source/fonts/FortAwesome/css/font-awesome.min.css" rel="stylesheet">
  <link rel="shortcut icon" href="favicon.ico" />
  <script type='text/javascript' src='js/jquery-m.js'></script><!-- jQuery -->
  <script type='text/javascript' src='js/magic.js'></script><!-- your script -->
</head>
</body> 

<div class='wrap'>
	<div class='p_side'>
		<? require 'side_spells.php'; ?>
	</div>
	<div class='p_cont'>
		<span id='before_spells'><div class='loader'></div>Читаем заклинания...</span>
	</div>
</div>


<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function (d, w, c) {
        (w[c] = w[c] || []).push(function() {
            try {
                w.yaCounter32640745 = new Ya.Metrika({
                    id:32640745,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true,
                    trackHash:true,
                    ut:"noindex"
                });
            } catch(e) { }
        });

        var n = d.getElementsByTagName("script")[0],
            s = d.createElement("script"),
            f = function () { n.parentNode.insertBefore(s, n); };
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://mc.yandex.ru/metrika/watch.js";

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    })(document, window, "yandex_metrika_callbacks");
</script>
<noscript><div style='display: none;'><img src="https://mc.yandex.ru/watch/32640745?ut=noindex" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
</body>
</html>