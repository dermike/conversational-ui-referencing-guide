{
  'use strict';
  let refguide,
    sleeping,
    sleeptime = 45000;
  const chat = document.querySelector('.chat');
  const content = document.querySelector('.content');
  const getJSON = (url, cb) => {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.timeout = 5000;
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        try {
          let response = JSON.parse(request.responseText);
          cb(response);
        } catch (e) {
          cb(false);
        }
      } else {
        cb(false);
      }
    };
    request.ontimeout = () => {
      cb(false);
    };
    request.onerror = () => {
      cb(false);
    };
    request.send();
  };

  const newMessage = (message, type = 'user') => {
    let bubble = document.createElement('section'),
      slideIn = (el, i) => {
        setTimeout(() => {
          el.classList.add('show');
        }, i * 150 ? i * 150 : 10);
      },
      scroll,
      scrollDown = () => {
        chat.scrollTop += bubble.offsetHeight / 20;
      };
    bubble.classList.add('message');
    bubble.classList.add(type);
    bubble.innerHTML = `<p>${message}</p>`;
    chat.appendChild(bubble);

    scroll = window.setInterval(scrollDown, 10);
    setTimeout(() => {
      window.clearInterval(scroll);
    }, 300);

    setTimeout(() => {
      bubble.classList.add('show');
    }, 10);

    if (type === 'user') {
      let animate = chat.querySelectorAll('button:not(:disabled)');
      for (let i = 0; i < animate.length; i += 1) {
        slideIn(animate[i], i);
      }
      bubble.classList.add('active');
    }
  };

  const randomReply = replies => {
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const startAlternatives = () => {
    newMessage('<button class="choice style apa">APA</button><button class="choice style vancouver">Vancouver</button>');
  };

  const checkUp = () => {
    let lastMessage = document.querySelector('.active'),
      sleepingReplies = [
        'Har du somnat? &#x1F634;',
        'PubMed and Chill? &#x2615;',
        'Är du kvar?',
        '&#x2744; &#x1F331; &#x1F31E; &#x1F342;'
      ];
    if (lastMessage) {
      lastMessage.parentNode.removeChild(lastMessage);
    }
    newMessage(randomReply(sleepingReplies), 'bot');
    setTimeout(() => {
      let helpReplies = [
        'Undrar du något kan du ringa <a href="tel:0852484000">08-524 840 00</a>, eller komma in till oss i KIB-labb mellan 11-16 på vardagar. &#x1F46B;',
        'Kom in till oss i KIB-labb mellan 11-16 på vardagar om du behöver mer hjälp eller ring <a href="tel:0852484000">08-524 840 00</a>. &#x1F4F2;',
        'Vill du prata referenser med en riktig person? &#x1F4AC; Kom in till oss i KIB-labb mellan 11-16 på vardagar.'
      ];
      newMessage(randomReply(helpReplies), 'bot');
      setTimeout(() => {
        let knowMoreReplies = [
            'Jag vill veta mer om hur jag refererar &#x1F61E;',
            'Vad är referenser nu igen? &#x1F631;',
            'Kan jag läsa mer om referenser någonstans? &#x1F680;'
          ],
          styleAgainReplies = [
            'Låt mig välja referensstil igen &#x1F4A1;',
            'Jag vill sätta igång! &#x1F525;',
            'Ok, kör &#x1F697;'
          ],
          categoriesAgainReplies = [
            'Visa kategorierna igen tack &#x2705;',
            'Ok, kör igen! &#x1F697;',
            'Jag vill välja källa &#x1F44D;'
          ];
        if (refguide) {
          newMessage(`<button class="choice newmenu showinfo">${randomReply(knowMoreReplies)}</button><br /><button class="choice newmenu showmenu">${randomReply(categoriesAgainReplies)}</button>`);
        } else {
          newMessage(`<button class="choice newmenu showinfo">${randomReply(knowMoreReplies)}</button><br /><button class="choice newmenu showstart">${randomReply(styleAgainReplies)}</button>`);
        }
      }, 300);
    }, 500);
  };

  const init = again => {
    let welcomeReplies = [
        'Hej, välkommen till KIBs referensguide! &#x1F603; I vilket format ska din referens vara? &#x1F64B;',
        'Hej! &#x1F44B; Välkommen till vår referensguide! Vilken referensstil använder du?'
      ],
      againReplies = [
        'Hmm, försök igen &#x1F635;',
        'Typiskt, är det inte din uppkoppling kan felet ligga hos oss &#x1F6A7; Testa gärna igen.',
        '&#x1F44E; Försök igen eller återkom senare...'
      ];
    sleeping = window.setInterval(() => {
      window.clearInterval(sleeping);
      checkUp();
    }, sleeptime);
    again ? newMessage(randomReply(againReplies), 'bot') : newMessage(randomReply(welcomeReplies), 'bot');
    setTimeout(() => {
      startAlternatives();
    }, 300);
  };

  const makeUserBubble = el => {
    el.parentNode.parentNode.classList.add('selected');
    el.parentNode.parentNode.classList.remove('active');
    el.parentNode.innerHTML = el.textContent;
  };

  const showMenu = again => {
    let menu = '',
      goBack = chat.querySelector('button.newmenu'),
      againReplies = [
        'Här är listan på källor igen... &#x1F64F;',
        '&#x1F331; Varsågod, kolla in något annat!',
        'Testa någon av de här... &#x1F64C;'
      ],
      replies = [
        'Vilken typ av källa är referensen? &#x1F4DA; &#x1F4F0; &#x1F4CA;',
        'Vad är det för typ av referens du undrar över?',
        'Börja med att välja en kategori &#x2B50;'
      ];
    if (goBack) {
      makeUserBubble(goBack);
    }
    setTimeout(() => {
      again ? newMessage(randomReply(againReplies), 'bot') : newMessage(randomReply(replies), 'bot');
      refguide.menu.forEach((val, index) => {
        menu += `<button class="choice menu" data-submenu="${index}">${val.title}</button>`;
      });
      setTimeout(() => {
        newMessage(menu);
      }, 500);
    }, 500);
    sleeping = window.setInterval(() => {
      window.clearInterval(sleeping);
      checkUp();
    }, sleeptime);
  };

  const loadStyle = style => {
    let replies = [
      'Ok, vänta... &#x1F4AA;',
      'Ett ögonblick... &#x1F440;',
      'En sekund bara... &#x1F60E;'
    ];
    newMessage(randomReply(replies), 'bot');
    getJSON('https://tools.kib.ki.se/jsonendpoint/referenceguide/' + style, (data) => {
      if (data) {
        let examples = '';
        examples += '<button class="close" aria-label="Stäng" tabindex="-1">&times;</button>';
        refguide = data;
        refguide.examples.forEach(val => {
          examples += `<article id="${val.id}">
                         <h3>${val.title}</h3>
                         ${val.body}
                       </article>`;
        });
        content.innerHTML = examples;
        showMenu();
      } else {
        let errorReplies = [
          '&#x1F622; Oops, något gick fel...',
          'Men... &#x1F621;',
          'Något funkar inte just nu &#x1F62B;'
        ];
        window.clearInterval(sleeping);
        newMessage(randomReply(errorReplies), 'bot');
        setTimeout(() => {
          init(true);
        }, 300);
      }
    });
  };

  const menuClick = clicked => {
    let submenu = '',
      menuChoice = refguide.menu[clicked.getAttribute('data-submenu')],
      replies = [
        '&#x1F44D; Vad vill du lära dig referera till?',
        'Vad vill du veta mer om? &#x1F648;',
        'Någon av de här som passar?'
      ],
      userReplies = [
        `Jag vill välja en annan källa än ${menuChoice.title.toLowerCase()} &#x1F61C;`,
        `Visa de andra källorna igen &#x1F633;`,
        `${menuChoice.title} i all ära, men kollar gärna något annat nu... &#x1F612;`
      ];
    newMessage(randomReply(replies), 'bot');
    menuChoice.submenu.forEach(val => {
      let id = `${menuChoice.id}-${val.id}`;
      submenu += `<button class="choice submenu" aria-controls="${id}" data-example="${id}">${val.title}</button>`;
    });
    submenu += `<br /><button class="choice submenu newmenu">${randomReply(userReplies)}</button>`;
    setTimeout(() => {
      newMessage(submenu);
    }, 500);
  };

  const toggleContent = article => {
    let closeButton = content.querySelector('.close'),
      buttons = chat.querySelectorAll('button');
    if (article) {
      article.classList.add('show');
      content.classList.add('show');
      content.setAttribute('aria-hidden', 'false');
      chat.setAttribute('aria-hidden', 'true');
      closeButton.tabIndex = '0';
    } else {
      content.classList.remove('show');
      content.setAttribute('aria-hidden', 'true');
      chat.setAttribute('aria-hidden', 'false');
      closeButton.tabIndex = '-1';
      setTimeout(() => {
        let active = document.querySelector('.content article.show');
        if (active) {
          active.classList.remove('show');
        }
      }, 300);
    }
    for (let i = 0; i < buttons.length; i += 1) {
      buttons[i].tabIndex = article ? '-1' : '0';
    }
  };

  const subMenuClick = clicked => {
    if (clicked.classList.contains('newmenu')) {
      showMenu(true);
    } else {
      toggleContent(document.getElementById(clicked.getAttribute('data-example')));
    }
  };

  document.addEventListener('click', e => {
    if (e.target.classList.contains('choice')) {
      window.clearInterval(sleeping);
      if (!e.target.classList.contains('submenu')) {
        makeUserBubble(e.target);
      }

      if (e.target.classList.contains('style')) {
        loadStyle(e.target.textContent.toLowerCase());
      }

      if (e.target.classList.contains('menu')) {
        menuClick(e.target);
      }

      if (e.target.classList.contains('submenu')) {
        subMenuClick(e.target);
      }

      if (e.target.classList.contains('showstart')) {
        startAlternatives();
      }

      if (e.target.classList.contains('showmenu')) {
        showMenu(true);
      }

      if (e.target.classList.contains('showinfo')) {
        let infoReplies = [
          'Här kan du läsa mer om hur du refererar',
          'På vår webbplats kan du läsa mer om referenser',
          'Ok, kolla den här länken:'
        ];
        newMessage(`${randomReply(infoReplies)} <a target="_new" href="https://kib.ki.se/skriva-referera/skriva-referenser">https://kib.ki.se/skriva-referera/skriva-referenser</a>`, 'bot');
        setTimeout(() => {
          let okReplies = [
            'OK &#x1F60E;',
            'Hur kommer jag tillbaka? &#x1F312;',
            'Ok, jag är redo! &#x1F44C;'
          ];
          if (refguide) {
            newMessage(`<button class="choice newmenu showmenu">${randomReply(okReplies)}</button>`);
          } else {
            newMessage(`<button class="choice newmenu showstart">${randomReply(okReplies)}</button>`);
          }
        }, 300);
      }
    }
    if (e.target.classList.contains('close')) {
      toggleContent();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.keyCode === 27) {
      toggleContent();
    }
  });

  setTimeout(() => {
    init();
  }, 500);
}
