$(document).ready(function() {



  //ROTATING CARDS

  // Detecta clique na carta para virá-la
  $(".card-container").click(function() {
    gira_carta($(this));
  });

  // Ações para girar cartas
  function gira_carta(estacarta) {
    //Rotaciona carta
    if (estacarta.hasClass('hover')) {
      estacarta.removeClass('hover');
    } else {
      estacarta.addClass('hover');
    }
  };


  // IMAGEM INTERATIVA

  $(".click-item").click(function() {
    var item = ($(".click-item").index(this));
    $(".item-ativo").removeClass("item-ativo");
    $(".item-destaque:eq(" + item + ")").addClass("item-ativo");
    $(".balao:eq(" + item + ")").addClass("item-ativo");
  });
  $(".click-item").hover(function() {
    var item = ($(".click-item").index(this));
    $(".item-destaque:eq(" + item + ")").toggle();
  });


  //SORTABLE

  //Função que recebe um array e devolve ele embaralhado.
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }


  //Array que vai guardar a ordem certa dos itens.
  let ordem = [];
  // Embaralha os dados dos sortable.

  function embaralha(){
    //Seleciona a seção que tem todos os quadradinhos laranjas.
    let enunciadosMaior = document.querySelectorAll('.sort-fixo')[0];
    //Array com os 3 quadradinhos laranjas.
    let enunciados = document.querySelectorAll('.sort-fixo > li');
    //Remove todos os quadradinhos laranjas.
    enunciadosMaior.innerHTML = '';

    //Seleciona a seção que tem todos os arrastáveis.
    let sortable = document.querySelectorAll('#sortable')[0];
    //Array com os 3 arrastáveis.
    let sortableElementos = document.querySelectorAll('#sortable > li');

    //Remove todos os arrastáveis.
    sortable.innerHTML = '';

    //Faz um 'shuffle' para embaralhar os quadradinhos laranjas
    let sorte = [0,1,2];
    sorte = shuffle(sorte);

    //Insere os quadradinhos laranjas novamente só que embaralhados.
    for (var i = 0; i < enunciados.length; i++) {
      let node = document.createElement("LI");
      node.innerHTML = enunciados[sorte[i]].innerHTML;
      enunciadosMaior.appendChild(node);
      //Guarda a nova ordem para futura correção.
      if(enunciados[sorte[i]].querySelector('p').innerHTML.trim() == 'Organização')
        ordem.push('.sort-inconsistencia');
      else if(enunciados[sorte[i]].querySelector('p').innerHTML.trim() == 'Tecnologia Interna')
        ordem.push('.sort-requisitos');
      else if(enunciados[sorte[i]].querySelector('p').innerHTML.trim() == 'Gerenciamento')
        ordem.push('.sort-alocacao');
    }
    //Faz novamente um shuffle, agora para embaralhar os arrastáveis.
    sorte = shuffle(sorte);

    // Insere os arrastáveis embaralhados.
    for (var i = 0; i < sortableElementos.length; i++) {
      let node = document.createElement("LI");
      node.innerHTML = sortableElementos[sorte[i]].innerHTML;
      node.classList = sortableElementos[sorte[i]].classList;
      node.id = sortableElementos[sorte[i]].id;
      sortable.appendChild(node);
    }
  }

  //funcao que recebe duas palavras e verifica se elas combinam conforme gabarito.
  function compara(palavra1, palavra2){
    if(palavra1 == 'Tecnologia Interna' && palavra2 == 'Requisitos e especificações inadequados.')
      return true;
    else if(palavra1 == 'Organização' && palavra2 == 'Inconsistência de custos, tempo e objetivos de escopo.')
      return true;
    else if(palavra1 == 'Gerenciamento' && palavra2 == 'Alocação e controle precários de recursos humanos, financeiros e de tempo.')
      return true;
    else
      return false;
  }

  function checaSeJaEstaResolvido(){
    //Seleciona a seção que tem todos os quadradinhos laranjas.
    let enunciadosMaior = document.querySelectorAll('.sort-fixo')[0];
    //Array com os 3 quadradinhos laranjas.
    let enunciados = document.querySelectorAll('.sort-fixo > li > p');
    //Seleciona a seção que tem todos os arrastáveis.
    let sortable = document.querySelectorAll('#sortable')[0];
    //Array com os 3 arrastáveis.
    let sortableElementos = document.querySelectorAll('#sortable > li');

    //Se alguma das três opções estiver certa a função já retorna TRUE
    for (var i = 0; i < 3; i++) {
      if(compara(enunciados[i].innerHTML.trim(),sortableElementos[i].innerHTML.trim()))
        return(true);
    }
    return(false);

  }

  //embaralha uma primeira vez
  embaralha();

  //Se estiver alguma certa, continua embaralhando até que não tenha nenhuma esteja certa.
  while(checaSeJaEstaResolvido()){
     embaralha();
  }


  // Funcionamento básico sortable
  $(function() {
    $("#sortable").sortable();
    $("#sortable").disableSelection();
  });

  // Pegar altura do maior elemento e padronizar pora todas as caixas
  function setaAlturaSortable() {
    var alturasortable = $("#maior-altura").css("height");
    $(".ordenar ul li").css("min-height", alturasortable)
  }

  // Compara a ordem dos itens e altera o estilo quando está na posição correta
  function compara_ordem() {
    //array com os itens declarados na ordem correta
    var item = []
    item[0] = $("#sortable " + ordem[0]);
    item[1] = $("#sortable " + ordem[1]);
    item[2] = $("#sortable " + ordem[2]);

    //contador de caixas no lugar correto
    var ordemcorreta = 0;
    //compara posição na tabela com a posição no array e aplica estilos
    for (n = 0; n < 3; n++) {
      var item_n = item[n];
      var nfixo = item_n.index() + 1;
      if (item_n.index() == n) {
        item_n.addClass("resolvido");
        $(".sort-fixo li:nth-of-type(" + nfixo + ")").addClass("resolvido");
        ordemcorreta++
      } else {
        item_n.removeClass("resolvido");
        $(".sort-fixo li:nth-of-type(" + nfixo + ")").removeClass("resolvido")
        ordemcorreta--
      }
    }
    // chama a função quando todos os itens estiverem na posição correta
    if (ordemcorreta == 3) {
      encerra_sortable();
    }
  }

  //desabilita sortable e chama feedback
  function encerra_sortable() {
    $("#sortable").sortable("disable");
    $("#sortable .resolvido").addClass("encerrado");
    $("#sort-feedback").fadeIn(1000);
    $(".bt-avancar").removeClass("avanco-off");
    $("#tela-2").removeClass("avanco-off");
  }

  //compara resultado ao reordenar os itens
  $(function() {
    $("#sortable").sortable({
      axis: 'y',
      containment: "parent",
      update: function(event, ui) {
        compara_ordem()
      },
    });
  });


  //TABELA PREENCHÍVEL
  var tabela = $(".tabela-container");
  var tabelaInput = tabela.find("input");

  var riscos = ["alagamento", "atraso", "incendio", "atraso1mes"];
  var graus = [
    ["0,4", "0.4"],
    ["0,035", "0.035"],
    ["0,08", "0.08"],
    ["0,01", "0.01"]
  ];

  // eventos para cálculo correto
  function aplicaOk(este_risco) {
    este_risco.prop("disabled", true);
    este_risco.siblings(".grau-ok").css("display", "flex").hide().fadeIn();
    este_risco.parent().siblings(".risco-desc").children().css("display", "flex").hide().fadeIn();
  }
  // eventos para cálculo incorreto
  function exibeTooltip(este_risco) {
    este_risco.siblings(".tooltip-feedback").show();
    este_risco.siblings(".tooltip-feedback").empty();
    este_risco.siblings(".tooltip-feedback").append("<p>Para chegar ao grau de risco, você deve multiplicar a <strong>probabilidade</strong> (" + valor_prob + ") pelo <strong>impacto</strong> (" + valor_imp + "). Tente novamente!</p>");
  }
  //eventos para entrada incorreta de dados (não numérico)
  function exibeTooltipErro(este_risco) {
    este_risco.siblings(".tooltip-feedback").show();
    este_risco.siblings(".tooltip-feedback").empty();
    este_risco.siblings(".tooltip-feedback").append("<p>Entre um número válido.</p>");
  }

  // Reseta input ao focar o campo
  tabelaInput.focusin(function() {
    $(this).val('');
  })

  // CHECA RESULTADOS AO MUDAR O FOCUS
  var tabelaAcerto = 0;

  // mostra feedback e libera botão após todos os itens corretos
  function mostrafeedback() {
    if (tabelaAcerto == 4) {
      $("#tabela-feedback").show();
      $("html, body").delay(600).animate({
        scrollTop: $("#tabela-feedback").offset().top
      }, 800);
      $(".bt-avancar").removeClass("avanco-off");
    }
  }

  // aceita enter como input para focusout
  tabelaInput.keypress(function(e) {
    if (e.which == 13) {
      $(this).focusout();
    }
  })

  tabelaInput.focusout(function() {

    $(".tooltip-feedback").hide();

    var val = $(this).val();

    if ($(this).is(":invalid")) {
      exibeTooltipErro($(this));
    }

    if ($(this).is(":disabled")) {
      console.log("desabilitado")
    } else {



      if ($(this).attr("name") == "alagamento") {
        valor_prob = "0,5";
        valor_imp = "0,8";
        if (val != "") {
          if (val == 0.4) {
            aplicaOk($(this));
            tabelaAcerto++;
            mostrafeedback();
          } else {
            exibeTooltip($(this));
          }
        }
      };

      if ($(this).attr("name") == "atraso") {
        valor_prob = "0,7";
        valor_imp = "0,05";
        if (val != "") {
          if (val == 0.035) {
            aplicaOk($(this));
            tabelaAcerto++;
            mostrafeedback();
          } else {
            exibeTooltip($(this));
          }
        }
      };

      if ($(this).attr("name") == "incendio") {
        valor_prob = "0,1";
        valor_imp = "0,8";
        if (val != "") {
          if (val == 0.08) {
            aplicaOk($(this));
            tabelaAcerto++;
            mostrafeedback();
          } else {
            exibeTooltip($(this));
          }
        }
      };

      if ($(this).attr("name") == "atraso1mes") {
        valor_prob = "0,1";
        valor_imp = "0,1";
        if (val != "") {
          if (val == 0.01) {
            aplicaOk($(this));
            tabelaAcerto++;
            mostrafeedback();
          } else {
            exibeTooltip($(this));
          }
        }
      };

    };


  });


  //CLASSIFICAR ITENS

  // muda estado dos botões
  function toggleAtivo(este) {
    este.toggleClass("ativo");
    este.siblings().removeClass("ativo");
  };

  $(".itens-classificacao>div>div").click(function() {
    toggleAtivo($(this));
    $("#tela-5>div>div#confira-novamente").hide()
  });

  function verificaResposta() {
    // atribui classes conforme a resposta
    $(".itens-classificacao.item-prev .acao-prev.ativo").each(
      function() {
        $(this).addClass("certo");
      }
    );
    $(".itens-classificacao.item-prev .acao-corr.ativo").each(
      function() {
        $(this).addClass("errado");
      }
    );
    $(".itens-classificacao.item-corr .acao-corr.ativo").each(
      function() {
        $(this).addClass("certo");
      }
    );
    $(".itens-classificacao.item-corr .acao-prev.ativo").each(
      function() {
        $(this).addClass("errado");
      }
    );
    // desabilita clique e hover
    $(".itens-classificacao div").addClass("sem-hover");
    // mostra feedback
    var respostasCertas = $(".certo").length;
    $("#classificacoes-certas").append(respostasCertas);
    $("#tela-5>div>div#classificacoes-resultado").show();

  };

  // aviso de resposta incompleta
  function confiraNovamente() {
    $("#tela-5>div>div#confira-novamente").show();
  }

  // checa qtd de itens respondidos e os confere se estiver tudo ok; senão, chama aviso
  $("#verifica-resposta").click(function() {
    var numItems = $(".itens-classificacao .ativo").length;
    if (numItems == 12) {
      verificaResposta();
      $(this).hide();
      $("html, body").animate({
        scrollTop: $(this).parent().parent().offset().top
      }, 800);
      $(".bt-avancar").removeClass("avanco-off");
      $("#tela-5").removeClass("avanco-off");
    } else {
      confiraNovamente();
    }
  });


  // CARROSSEL
  //desabilita autoplay do carousel
  $(".carousel").carousel({
    interval: false
  });

  //ajusta altura em relação ao primeiro slide
  function ajustaAlturalCarousel1() {
    var alturaSlide1 = $("#alturaCarousel1").height();
    $(".carousel-simples>div").height(alturaSlide1);
  };

  function ajustaAlturalCarousel2() {
    var alturaSlide2 = $("#alturaCarousel2").height();
    $(".carousel-cards>div").height(alturaSlide2);
  }

  //NAVEGAÇÃO

  //CONTROLA NAVEGAÇAO
  var telas = ["#tela-a", "#tela-b", "#tela-1", "#tela-2", "#tela-3", "#tela-3b", "#tela-4", "#tela-5", "#tela-6", "#tela-fim"]
  var n_telaAtual = 0
  var telaAtual = telas[n_telaAtual]

  //CONTROLA GUIA LATERAL
  function controlaNavLateral() {
    $(".nav-lateral div").removeClass("ativo");
    if (n_telaAtual == 2) {
      $(".nav-lateral").css("display", "flex");
      $(".nav-lateral div:first-child").addClass("ativo");
      $(".nav-lateral div:nth-child(2)").addClass("ativo");
    }
    if (n_telaAtual == 3) {
      $(".nav-lateral div:nth-child(2)").addClass("ativo");
    }
    if (n_telaAtual == 4 || n_telaAtual == 5) {
      $(".nav-lateral div:nth-child(3)").addClass("ativo");
    }
    if (n_telaAtual == 6 || n_telaAtual == 7) {
      $(".nav-lateral div:nth-child(4)").addClass("ativo");
      $(".nav-lateral div:nth-child(5)").addClass("ativo");
    }
    if (n_telaAtual == 8) {
      $(".nav-lateral").css("display", "flex");
      $(".nav-lateral div:nth-child(6)").addClass("ativo");
    }
    if (n_telaAtual == 0 || n_telaAtual == 1 || n_telaAtual == 9) {
      $(".nav-lateral").css("display", "none");
    }
  }

  function ajustaAlturas() {
    if (n_telaAtual == 3) {
      setaAlturaSortable();
    }
    if (n_telaAtual == 8) {
      ajustaAlturalCarousel1();
    }
    if (n_telaAtual == 9) {
      ajustaAlturalCarousel2();
    }
  }

  // Controla visibilidade dos botões de navegação
  function visibilidadeNavegacao() {
    if (n_telaAtual == 0) {
      $(".botoes-nav").hide();
    } else {
      $(".botoes-nav").show();
    }
    if (n_telaAtual == 9) {
      $(".bt-avancar").hide();
      $(".bt-inicio").show();
    } else {
      $(".bt-avancar").show();
      $(".bt-inicio").hide();
    }
  }

  $(".bt-avancar").click(function() {
    $(telaAtual).hide();
    n_telaAtual++;
    telaAtual = telas[n_telaAtual];
    $(telaAtual).fadeIn();
    ajustaAlturas()
    visibilidadeNavegacao();
    controlaNavLateral();
    window.scrollTo(0, 0);
    if ($(telaAtual).hasClass("avanco-off")) {
      $(".bt-avancar").addClass("avanco-off");
    };
  });

  $(".bt-voltar").click(function() {
    $(telaAtual).hide();
    n_telaAtual--;
    telaAtual = telas[n_telaAtual];
    $(telaAtual).fadeIn();
    ajustaAlturas()
    visibilidadeNavegacao();
    controlaNavLateral();
    window.scrollTo(0, 0);
    $(".bt-avancar").removeClass("avanco-off");
  });

  $(".bt-inicio").click(function() {
    // $(telaAtual).hide();
    // n_telaAtual = 0;
    // telaAtual = telas[n_telaAtual];
    // $(telaAtual).fadeIn();
    // visibilidadeNavegacao();
    // window.scrollTo(0, 0);
    location.reload();
  });

});
