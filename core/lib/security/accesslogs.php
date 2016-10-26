<?php
    require_once $_SERVER["DOCUMENT_ROOT"].'/api/PDF/autoload.inc.php';
    
    use Dompdf\Dompdf;
    $pdf=new DomPdf();
    $pdf->loadHtml('
    <style>
        tr {
            border: 2px solid black;
        }
    </style>
    <table>
        <tr>
            <td>Box 1</td>
            <td>Box 2</td>
        </tr>
        <tr>
            <td>Box 3</td>
            <td>Box 4</td>
        </tr>
    </table>
    ');

    $pdf->setPaper("A4", "portrait");

    $pdf->render();
    $myfile = fopen("dump.pdf", "w") or die("Unable to open file!");
    fwrite($myfile, "");
    fclose($myfile);
    file_put_contents("dump.pdf", $pdf->output());

    header("Content-type: application/pdf");

    echo file_get_contents("dump.pdf");
?>