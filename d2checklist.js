// ==UserScript==
// @name         D2 Checklist Mini-Tools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add some small tools for www.d2checklist.com
// @author       You
// @match        https://www.d2checklist.com/clan/*/milestones
// @match        https://www.d2checklist.com/clan/*/members
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * debug output function
     *
     * @param txt the text to put into console
     */
    function _debug(txt) {
        if (js_debug) {
            var d = new Date();
            var now = [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()].join(':');
            console.log(now + ': ' + txt);
        }
    }

    // --- stylesheets ---
    var css = [];
    if (true) {
        // dialog CSS
        css.push("#qs-onoff { position: absolute; left: 15vw; border-style: hidden; background: #eee; padding: 2px 5px; }");
        css.push('#quick-search-bar { text-align: left; width: 100%; max-width: 90vw !important; margin: 10px auto 0; }');
        css.push('#all { display: inline-block; margin: 0 15px 0 0; }');
        css.push('#quick-search { width: 50vw; margin: 0; }');
    }
    css = css.join(' ');

    /**
     * insert custom CSS
     *
     * @param css the stylesheets
     * @param css_id the CSS-id of the <style>-tag
     */
    function insertCss(css, css_id) {
        var style = document.createElement('STYLE');
        if (css_id) {
            style.id = css_id;
        }
        style.innerHTML = css;
        document.querySelector('head').appendChild(style);
    }

    /**
     * replace old styles-element with new one
     *
     * @param css the stylesheets
     * @param css_id the CSS-id of the <style>-tag
     */
    function updateCss(css, css_id) {
        var styles = document.querySelector('#' + css_id);
        if (styles) {
            styles.parentNode.removeChild(styles);
        }
        insertCss(css, css_id);
    }

    function showHideMembers(hide) {
        var all = document.querySelector('#see-all');
        var rows = document.querySelectorAll('table.clan-table tbody > tr');
        if (hide === false) {
            rows.forEach(function(elem) { elem.style.display = 'table-row'; });
            all.checked = '';
        } else {
            if (all.checked == true || hide == true) { // is true because the click on unchecked input field switch to checked and then this script is called
                rows.forEach(function(elem) { elem.style.display = 'none'; });
                all.checked = 'checked';
            } else {
                rows.forEach(function(elem) { elem.style.display = 'table-row'; });
                all.checked = '';
            }
        }
    }

    function quickSearch(e) {
        var search = document.querySelector('#quick-search');
        var term = search.value;
        if (e.which == 13 || term.length > 3) {
            console.log('quick-search: ' + term);
            showHideMembers(true);
            var rows = document.querySelectorAll('table.clan-table tbody > tr');
            rows.forEach( function(elem) {
                if (elem.querySelector('.lead a').innerText.toLowerCase().indexOf(term) != -1) {
                    elem.style.display = 'table-row';
                }
            });
        } else {
            showHideMembers(false);
        }
    }

    function insertSearchField() {
        var btn = document.querySelector('#qs-onoff');
        btn.removeEventListener('click', insertSearchField);
        btn.parentNode.removeChild(btn);

        var table = document.querySelector('.main nav + div');
        var row = document.createElement('div');
        var all = document.createElement('input');
        var search = document.createElement('input');
        row.id = "quick-search-bar";
        all.id = "see-all";
        all.type= "checkbox";
        all.addEventListener('click', showHideMembers);
        search.id = "quick-search";
        search.type = "text";
        search.addEventListener('keyup', quickSearch);
        row.appendChild(all);
        row.appendChild(search);
        table.parentNode.insertBefore(row, table);
    }

    function initQuickSearch() {
        console.log('wait for 5 seconds to start ...');
        window.setTimeout( function() {
            console.log('init quick-search button');
            var h3 = document.querySelector('.main h3.clan-name');
            var btn = document.createElement('button');
            btn.id = "qs-onoff";
            btn.innerText = "quick search";
            btn.addEventListener('click', insertSearchField);
            h3.parentNode.insertBefore(btn, h3);
        }, 5000);
    }

    // ------------------
    updateCss(css);
    initQuickSearch();
})();