import $ from 'jquery';

// class is the who
class Search {
    // 1. describe and create/initiate our object (what we do it to)
    constructor() {
        this.addSearchHTML();
        this.resultsDiv = $("#search-overlay__results");
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.searchField = $("#search-term");
        this.events();
        this.isOverlayOpen = false;
        this.isLoading = false;
        this.previousValue;
        this.isTyping;

    }
    
    //  2. event (when we do it)
    events() {
        this.openButton.on("click", this.openOverlay.bind(this));
        this.closeButton.on("click", this.closeOverlay.bind(this));
        $(document).on("keydown", this.keyPressDispatcher.bind(this));
        this.searchField.on("keyup", this.typingLogic.bind(this));
    }

    // 3. methods (function, action... ) (how we're gonna do)

    typingLogic() {
        if (this.searchField.val() != this.previousValue) {
            clearTimeout(this.isTyping);

            if (this.searchField.val()) {
                if (!this.isLoading) {
                    this.resultsDiv.html('<div class="spinner-loader"></div>');
                    this.isLoading = true;
                }
                this.isTyping = setTimeout(this.getResults.bind(this), 750);
            } else {
                this.resultsDiv.html('');
                this.isLoading = false;
            }

            
        }

        this.previousValue = this.searchField.val();
    }

    
    getResults() {

        $.getJSON(siteData.root_url + '/wp-json/university/v1/search?term=' + this.searchField.val(), (results) => {
            this.resultsDiv.html(`
                <div class="row">
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">General Information</h2>
                        ${results.generalInfo.length ? '<ul class="link-list min-list">' : '<h3>No general information available for this search term.</h3>'}
                            ${results.generalInfo.map(item => {
                                return `<li><a href="${item.url}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}` : ''}</li>`;
                            }).join('')}
                        ${results.generalInfo.length ? '</ul>' : ''}
                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Programs</h2>
                        ${results.programs.length ? '<ul class="link-list min-list">' : `<h3>No programs match this search. <p><a href="${siteData.root_url}/programs">View All Programs</a></p></h3>`}
                            ${results.programs.map(item => {
                                return `<li><a href="${item.url}">${item.title}</a></li>`;
                            }).join('')}
                        ${results.programs.length ? '</ul>' : ''}
                        <h2 class="search-overlay__section-title">Professors</h2>
                        ${results.professors.length ? '<ul class="professor-cards">' : `<h3>No Professors match this search.</h3>`}
                            ${results.professors.map(item => {
                                return `
                                <li class="professor-card__list-item">
                                    <a class="professor-card" href="${item.permalink}">
                                    <img class="professor-card__image" src="${item.image}">
                                    <span class="professor-card__name">${item.title}</span>
                                    </a>
                                </li>
                                `;
                            }).join('')}
                        ${results.professors.length ? '</ul>' : ''}
                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Campuses</h2>
                        ${results.campuses.length ? '<ul class="link-list min-list">' : `<h3>No campuses match this search. <p><a href="${siteData.root_url}/campuses">View All Campuses</a></p></h3>`}
                            ${results.campuses.map(item => {
                                return `<li><a href="${item.url}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}` : ''}</li>`;
                            }).join('')}
                        ${results.campuses.length ? '</ul>' : ''}
                        <h2 class="search-overlay__section-title">Events</h2>
                        ${results.events.length ? '' : `<h3>No events match this search. <p><a href="${siteData.root_url}/events">View All Events</a></p></h3>`}
                            ${results.events.map(item => {
                                return `
                                    <div class="event-summary">
                                        <a class="event-summary__date t-center" href="${item.url}">
                                        <span class="event-summary__month">${item.month}</span>
                                        <span class="event-summary__day">${item.day}</span>
                                        </a>
                                        <div class="event-summary__content">
                                        <h5 class="event-summary__title headline headline--tiny"><a href="${item.url}">${item.title}</a></h5>
                                        <p>${item.description}<a href="${item.url}" class="nu gray"> Learn more</a></p>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                    </div>
                </div>

            `);
            this.isLoading = false;
        });
    }

    keyPressDispatcher(e) {

        if (e.keyCode == 83 && !this.isOverlayOpen && !$("input, textarea").is(':focus')) {
            this.openOverlay();
        }

        if (e.keyCode == 27 && this.isOverlayOpen) {
            this.closeOverlay();
        }
    }

    openOverlay() {
        this.searchOverlay.addClass("search-overlay--active");
        $("body").addClass("body-no-scroll");
        this.isOverlayOpen = true;
        this.searchField.val('');
        setTimeout(() => {
            this.searchField[0].focus();
        }, 301);
    }

    closeOverlay() {
        this.searchOverlay.removeClass("search-overlay--active");
        $("body").removeClass("body-no-scroll");
        this.isOverlayOpen = false;
    }

    addSearchHTML() {
        $("body").append(`
            <div class="search-overlay">
                <div class="search-overlay__top">
                    <div class="container">
                        <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
                        <input placeholder="What are you looking for?" type="text" class="search-term" id="search-term" autocomplete="off">
                        <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
                    </div>
                </div>
        
                <div class="container">
                    <div id="search-overlay__results"></div>
                </div>
            </div>
        `)
    }
}

export default Search