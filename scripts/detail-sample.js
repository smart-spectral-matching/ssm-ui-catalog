import 'materialize-css'; // It installs the JS asset only
import 'materialize-css/dist/css/materialize.min.css';
import "../styles/detail";

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".collapsible");
  var instances = M.Collapsible.init(elems, {});
});
