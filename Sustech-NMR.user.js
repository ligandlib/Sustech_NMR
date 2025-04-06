// ==UserScript==
// @name         Sustech NMR
// @namespace    http://tampermonkey.net/
// @version      20250406
// @description  自动完成预约流程
// @author       xingmu
// @match        https://openlab.sustech.edu.cn/console/appointment/*
// @match        https://openlab.sustech.edu.cn/Console/Appointment/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    function scrollToBottom() {
        const container = document.querySelector('.step-item.step-0 [id^="appoint"]');
        if (container && container.scrollHeight > container.clientHeight) {
            container.scrollTop = container.scrollHeight;
            console.log('Scrolled to the bottom');
        }
    }

    function observeDOM() {
        const observer = new MutationObserver(() => {
            if (document.querySelector('.step-item.step-0 [id^="appoint"]')) {
                setTimeout(scrollToBottom, 3000);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'complete') {
        observeDOM();
    } else {
        window.addEventListener('load', observeDOM);
    }

    let isSubmitClicked = false;

    function isStepCompleted(stepIndex) {
        return !!document.querySelector(`.step-item.step-${stepIndex}`);
    }

    function clickNextStep() {
        const nextButton = document.getElementById('nextStep');
        if (nextButton) {
            nextButton.click();
            console.log('Next button clicked');
        } else {
            console.error('No Next button found');
        }
    }

    function autoAgreeAndSubmit() {
        if (isSubmitClicked) return;

        const checkbox = document.querySelector('input[name="hasReadTheNotice"]');
        if (checkbox && !checkbox.checked) {
            checkbox.click();
            console.log('Checked the terms of agreement');
        }

        setTimeout(() => {
            const submitButton = document.getElementById('submitBooking');
            if (submitButton) {
                submitButton.click();
                console.log('Submit button clicked');
                isSubmitClicked = true;
            }
        }, 800);
    }

    function addTriggerButton() {
        const button = document.createElement('button');
        button.textContent = 'My machine time！';
        Object.assign(button.style, {
            position: 'fixed',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            zIndex: '1000',
            padding: '15px 35px',
            backgroundColor: '#1677ff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease'
        });

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#125bb5';
        });

        button.addEventListener('click', () => {
            console.log('Click the button to start executing the script');
            if (isStepCompleted(0)) {
                clickNextStep();
                if (isStepCompleted(1)) {
                    clickNextStep();
                    if (isStepCompleted(2)) {
                        autoAgreeAndSubmit();
                    } else {
                        console.error('Step 3 not detected');
                    }
                } else {
                    console.error('Step 2 not detected');
                }
            } else {
                console.error('Step 1 not detected');
            }
        });

        document.body.appendChild(button);
    }

    if (document.readyState === 'complete') {
        addTriggerButton();
    } else {
        window.addEventListener('load', addTriggerButton);
    }
})();
