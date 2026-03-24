document.addEventListener("DOMContentLoaded", () => {

  fetch("/maquinas")
    .then(res => res.json())
    .then(data => {

      let html = "";

      data.forEach(m => {

        html += `
        <div class="col-md-4 mb-4">
          <div class="card p-3 shadow">

            <div class="img-box">
              <img src="${m.imagem}" class="img-fluid">
            </div>

            <h5>${m.nome}</h5>
            <p>${m.descricao}</p>

            <span class="${m.status === 'disponivel' ? 'badge bg-success' : 'badge bg-danger'}">
              ${m.status}
            </span>

            <a href="https://wa.me/5511999999999" target="_blank" class="btn btn-success mt-2">
              WhatsApp
            </a>

          </div>
        </div>
        `;
      });

      document.getElementById("lista").innerHTML = html;
    });

});