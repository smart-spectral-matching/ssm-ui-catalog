import "materialize-css";
import "../node_modules/materialize-css/dist/css/materialize";
import "../styles/detail";

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".collapsible");
  var instances = M.Collapsible.init(elems, {});
});
