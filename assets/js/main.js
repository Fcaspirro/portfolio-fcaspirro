/* SHOW SIDEBAR */
const navMenu = document.getElementById('sidebar'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/* SIDEBAR SHOW */
if(navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.add('show-sidebar')
        document.body.classList.remove('show-sidebar')
    })
}

/* SIDEBAR HIDDEN */
if(navClose) {
    navClose.addEventListener("click", () => {
        navMenu.classList.remove('show-sidebar')
    })
}

document.querySelectorAll(".nav_item").forEach((elemento) => {
    elemento.addEventListener("click", () => {
      navMenu.classList.remove("show-sidebar");
    });
});

/* INTRODUTION */
let typed = new Typed (".inputdescription", {
    strings: [" Fabio Caspirro.", "Desenvolvedor Web.", "Desenvolvedor Mobile.", "Designer Gráfico."],
    typeSpeed: 80,
    backSpeed: 50,
    loop: true
}); 

/* SKILLS TABS */
const tabs = document.querySelectorAll('[data-target]'),
    tabContent = document.querySelectorAll('[data-content]')

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = document.querySelector(tab.dataset.target)

            tabContent.forEach(tabContents => {
                tabContents.classList.remove('skills_active')
            })

            target.classList.add('skills_active')

            tabs.forEach(tab => {
                tab.classList.remove('skills_active')
            })

            tab.classList.add('skills_active')
        })
    })

/* MIXITUP FILTER PORTFOLIO */
let mixerPortfolio = mixitup('.project_container', {
    selectors: {
        target: '.project_card'
    },
    animation: {
        duration: 500
    }
});

/* LINK ACTIVE PROJECTS */
const linkProject = document.querySelectorAll('.project_item')

function activeProject() {
    linkProject.forEach(l=> l.classList.remove('active_project'))
    this.classList.add('active_project')
}

linkProject.forEach(l=> l.addEventListener("click", activeProject))

/* PROJECT MODAL */
document.addEventListener("click", (e) => {
    if(e.target.classList.contains("project_button")) {
        togglePorfolioModal();
        portfolioItemDetails(e.target.parentElement);
    }
})

function togglePorfolioModal() {
    document.querySelector(".portfolio_modal").classList.toggle("open");
}

document.querySelector(".portfolio_modal-close").addEventListener("click", togglePorfolioModal)

function portfolioItemDetails(portfolioItem) {
    document.querySelector(".modal_thumbnail img").src = portfolioItem.querySelector(".project_img").src;
    document.querySelector(".portfolio_modal-subtitle span").innerHTML = portfolioItem.querySelector(".project_title").innerHTML;
    document.querySelector(".portfolio_modal-body").innerHTML = portfolioItem.querySelector(".portfolio_item-details").innerHTML;
}

/* SERVICES MODAL */
const modalViews = document.querySelectorAll('.services_modal'),
      modelBtns = document.querySelectorAll('.services_button'),
      modalCloses = document.querySelectorAll('.services_modal-close')

let modal = function(modalClick) {
    modalViews[modalClick].classList.add('active-modal')
}

modelBtns.forEach((modelBtn, i) => {
    modelBtn.addEventListener('click', () => {
        modal(i)
    })
})

modalCloses.forEach((modalClose) => {
    modalClose.addEventListener("click", () => {
        modalViews.forEach((modalView) => {
            modalView.classList.remove('active-modal')
        })
    })
})

/* INPUT ANIMATION */
const inputs = document.querySelectorAll(".input");

function focusFunc() {
    let parent = this.parentNode;
    parent.classList.add("focus");
}

function blurFunc() {
    let parent = this.parentNode;
    if(this.value == "") {
        parent.classList.remove("focus");
    }
}

inputs.forEach((input) => {
    input.addEventListener("focus", focusFunc);
    input.addEventListener("blur", blurFunc);
})

/* SCROLL SECTIONS ACTIVE LINK */
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", navHighlighter);

function navHighlighter()
{
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight; 
        const sectionTop = current.offsetTop -500,
        sectionId = current.getAttribute("id");

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight)
        {
            document.querySelector('.nav_menu a[href*=' + sectionId + ']').classList.add("active-link")
        }
        else
        {
            document.querySelector('.nav_menu a[href*=' + sectionId + ']').classList.remove("active-link")
        }
    })
}

/* SHOW SCROLL UP */
let span = document.querySelector(".scrollTop");

window.onscroll = function () {
    this. scrollY >= 300 ? span.classList.add("show") : span.classList.remove("show");
};

span.onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};