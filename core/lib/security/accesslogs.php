<?php
require 'database.php';
require 'admins.php';

session_start();
use Dompdf\Dompdf;

$content="pdf";
if(isset($_GET["out"])) $content=$_GET["out"];
$valid=false;
//Check admins
if(isset($_SESSION["id"])) {
    foreach($admins as $id) {
        if($id==$_SESSION["id"]) {
            $valid=true;
        }
    }
}
if($valid) {
    if($content="pdf") {
        require_once $_SERVER["DOCUMENT_ROOT"].'/api/PDF/autoload.inc.php';

        $pdf=new DomPdf();

        $html='
        <style>
            table {
                color: #333;
                font-family: Helvetica, Arial, sans-serif;
                font-size: 8pt;
                width: 640px;
                border-collapse:
                collapse; border-spacing: 0;
            }
            th {
                font-size: 10pt;
            }
            td, th {
                border: 1px solid black; /* No more visible border */
                padding: 0px;
                margin: 0px;
            }

            th {
                background: #DFDFDF; /* Darken header a bit */
                font-weight: bold;
            }

            td {
                background: #FAFAFA;
                text-align: left;
                padding-left: 3px;
            }
        </style>
        <table>
        ';
        $sql="SELECT * FROM `storage_attempts` ORDER BY `id`";
        if($result=$server->query($sql)) {
            $first=true;
            $count=0;
            while($row=$result->fetch_assoc()) {
                if($first) {
                    $html.="<tr>";
                    foreach($row as $key=>$val) {
                        $html.="<th>".$key."</th>";
                    }
                    $html.="</tr>";
                }
                $html.="<tr>";
                foreach($row as $key=>$val) {
                    $html.="<td>".$val."</td>";
                }
                $html.="</tr>";

                $first=false;
                $count++;
            }
        }
        else {
            $html.="<tr><th>Error!</th></tr>";
        }

        $pdf->loadHtml($html);

        //Set paper to portrait
        $pdf->setPaper("A4", "portrait");

        //Generate file dump.pdf, containing MySQL datalogs dump.
        $pdf->render();
        $myfile = fopen("dump.pdf", "w") or die("Unable to open file!");
        fwrite($myfile, "");
        fclose($myfile);
        file_put_contents("dump.pdf", $pdf->output());

        header("Content-type: application/pdf");

        echo file_get_contents("dump.pdf");
        unlink("dump.pdf");
    }
    else if($content="csv") {
        $output="";
        if($result=$server->query($sql)) {
            while($row=$result->fetch_assoc()) {
                $line="";
                foreach($row as $key=>$value) {
                    $line.="\"$value\",";
                }
                $output.=rtrim($line);
            }
        }
        else {
            $output="An Error Occured!";
        }
        header("Content-type: text/csv");
        echo $out;
    }
}
else {
    echo "Access Denied!";
}
?>