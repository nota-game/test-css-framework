(function () {

    const template = document.createElement('template');
    template.innerHTML = `
    <style>
:host {
    display: block
}

a {
    /*Unless :part() is better supported ;P*/
    color: var(--main-txt-color);
}

input {
    display: none;
    /* Hide the default checkbox */
}

label {}

label:checked {
    background: blue;
}

label:before {
    display: inline-block;

    content: '\\25B6';
    width: .5em;
    height: .5em;
    margin: .5em;
    margin-right: 1em;

}

input+span {}

/* Style its checked state...with a ticked icon */
input:checked+label:before {
    content: '\\25BC';
}

label.leaf:before {
    content: '\\25a0';
}

input:checked+label.leaf:before {
    content: '\\25a0';
}

div {
    display: none;
    margin-left: 1.5em;
}

input:checked~div {
    display: block;
}

label.leaf+div {
    display: none;
}
</style>
<input id="arrow" type='checkbox'>
<label for="arrow"> </label>
<a part="a"></a>
<div>
<slot></slot>
</div>  `;

    class TreeMenu extends HTMLElement {
        constructor() {
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(template.content.cloneNode(true));

            this.link = this.shadowRoot.querySelector('a');
            this.span = this.shadowRoot.querySelector('label');



        }

        connectedCallback() {
            if (this.children.length == 0) {
                this.span.className = 'leaf';
            }

            // Select the node that will be observed for mutations

            // Options for the observer (which mutations to observe)
            const config = { attributes: false, childList: true, subtree: false };

            // Callback function to execute when mutations are observed
            const callback = (mutationsList, observer) => {
                if (this.children.length == 0) {
                    this.span.className = 'leaf';
                } else {
                    this.span.className = '';
                }
            };

            // Create an observer instance linked to the callback function
            this.observer = new MutationObserver(callback);

            // Start observing the target node for configured mutations
            this.observer.observe(this, config);


            // this.incrementBtn.addEventListener('click', this.increment);
            // this.decrementBtn.addEventListener('click', this.decrement);

            // if (!this.hasAttribute('value')) {
            //     this.setAttribute('value', 1);
            // }
        }

        appendChild(newChild) {
            super.appendChild(newChild);
        }



        static get observedAttributes() {
            return ['title', 'href'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'title') {
                this.link.innerText = newValue;

            } else if (name === 'href') {
                this.link.href = newValue;
            } else {
                this.link.innerText = 'bla';

            }
        }

        get title() {
            return this.getAttribute('title');
        }

        get href() {
            return this.getAttribute('href');
        }


        set title(newValue) {
            this.setAttribute('title', newValue);
        }

        set href(newValue) {
            this.setAttribute('href', newValue);
        }



        disconnectedCallback() {
            // Later, you can stop observing
            this.observer.disconnect();

        }
    }

    window.customElements.define('tree-menu', TreeMenu);
})();
