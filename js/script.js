// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

let chartOn = false;

//Create savings bars svg mask
function makeSavings() {
    let mask = document.getElementById('mask');
    var height = 140;
    var xCoord = function (iteratorI, iteratorJ) {
        if (iteratorI === 5) {
            var space = 24;
            if (iteratorJ === 4) {
                space = 25;
            }
            return ((5 * iteratorI) * 24) + space + (iteratorJ * 26);
        } else if (iteratorI === 4) {
            return (((5 * iteratorI) + iteratorJ) * 24) + 24;
        } else {
            return ((5 * iteratorI) + iteratorJ) * 24;
        }
    };
    var idNumber = function (iteratorI, iteratorJ) {
        var space = 0;
        if (iteratorI > 3) {
            space = 1;
        }
        return (31 - (iteratorI * 5) - iteratorJ - space);
    };
    for (var i = 0; i <= 5; i++) {
        var counter = 5,
            width = '14px';
        if (i === 5) {
            width = '15px';
        } else if (i === 3) {
            counter = 6;
        }
        for (var j = 0; j < counter; j++) {
            var savingsBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            savingsBar.id = 'savings-bar-' + idNumber(i, j);
            savingsBar.classList.add('savings-bar');
            savingsBar.setAttribute('width', width);
            savingsBar.setAttribute('height', height + 'px');
            savingsBar.setAttribute('x', xCoord(i, j));
            savingsBar.setAttribute('y', '0');
            // savingsBar.style.transformOrigin = 'center center';
            mask.appendChild(savingsBar);
        }
        height -= 20;
        savingsBar.setAttribute('y', '0');
        mask.appendChild(savingsBar);
    }
};

//Create cost bars svg elements
function makeCost() {
    let chart = document.getElementById('cost-bars');
    let height = 35,
        yCoord = parseInt(document.getElementById('clip-path').getAttribute('height')) - 35;
    for (var i = 0; i < 6; i++) {
        var costBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        costBar.id = 'cost-bar-' + (i + 1);
        costBar.classList.add('cost-bar');
        costBar.setAttribute('width', '120px');
        costBar.setAttribute('height', height + 'px');
        costBar.setAttribute('y', yCoord);
        // costBar.style.transformOrigin = 'center bottom';
        height += 20;
        yCoord -= 20;
        if (i >= 4) {
            costBar.setAttribute('x', (120 * i) + 24);
        } else {
            costBar.setAttribute('x', (120 * i));
        }
        chart.appendChild(costBar);
    }
}

//Make savings and cost bars, and apply SVG mask
function makeMask() {
    makeSavings();
    makeCost();
    let url = 'url(#mask)';
    document.getElementById('cost-savings__chart').style['mask'] = url;
}

makeMask();

//Hide all savings bars
function hideSavings() {
    var savingsBars = document.getElementsByClassName('savings-bar'),
        timeline = new TimelineMax();
    for (var i = savingsBars.length; i > 0; i--) {
        var bar = document.getElementById('savings-bar-' + i),
            barTimeline = new TimelineMax();
        let scaleY;
        if (bar.id > 26) {
            scaleY = 0.86;
        } else if (bar.id > 21) {
            scaleY = 0.83;
        } else if (bar.id < 16) {
            scaleY = 0.8;
        } else if (bar.id  < 10) {
            scaleY = 0.75;
        } else if (bar.id < 5) {
            scaleY = 0.67;
        } else {
            scaleY = 0.5;
        }
        tween = new TweenMax.to(bar, 1, {opacity: 0, scaleX: 0.71, scaleY: scaleY, transformOrigin:"center top"});
        timeline.add(tween);
    }
    timeline.duration(1.8);
    // var time = timeline.duration();
    timeline.tweenTo(timeline.duration(), {ease: Power2.easeOut, onComplete: addListener});
}

function hideCost() {
    var costBars = document.getElementsByClassName('cost-bar'),
        timeline = new TimelineMax();
    for (var i = costBars.length; i > 0; i--) {
        var bar = document.getElementById('cost-bar-' + (i));
        tween = TweenMax.to(bar, 1, {scaleY: 0, transformOrigin: 'center bottom'});
        timeline.add(tween);
    }
    timeline.duration(1.8);
    // var time = timeline.duration();
    timeline.tweenTo(timeline.duration(), {ease: Power2.easeOut});
}

function removeElem(e) {
    e.target.classList.add('removed');
}

function addInfoBox() {
    document.getElementById('info-box').classList.remove('removed');
}

function exploreDiversions() {
    let title = document.getElementById('header-title'),
        logo = document.getElementById('logo'),
        nav = document.getElementById('nav'),
        landingNav = document.getElementById('landing-nav'),
        skeleton = document.getElementById('skeleton-wrapper'),
        footer = document.getElementById('footer');
    // landingNav.addEventListener('transitionend', removeElem);
    landingNav.addEventListener('transitionend', addInfoBox);
    landingNav.classList.add('landing-nav--off');
    landingNav.addEventListener('transitionend', removeElem);
    logo.classList.remove('off');
    nav.classList.remove('off');
    title.classList.add('header__title--animating');
    title.classList.add('header__title--left');
    skeleton.addEventListener('transitionend', removeElem, {once: true});
    skeleton.classList.add('off-cheat');
    footer.classList.remove('hidden');
    footer.classList.remove('off-cheat');
    let elem = document.getElementById('step-1');
    let style = window.getComputedStyle(elem, null);
    chartOn = true;
    hideSavings();
    hideCost();
    previousState.previousChartState = 7;
    previousState.previousCostBar = 0;
    previousState.previousSavingsBar = 0;
    previousState.previousStepNumber = 0;
    previousState.previousDiversionNumber = 0;
}

function backToDiversions() {
    previousState.previousChartState = 7;
    previousState.previousCostBar = 0;
    previousState.previousSavingsBar = 0;
    previousState.previousStepNumber = 0;
    previousState.previousDiversionNumber = 0;
    hideSavings();
    hideCost();
    addInfoBox();
    document.getElementById('main-wrapper').classList.remove('clicky');
    document.getElementById('diversions').addEventListener('click', diversion);
    document.getElementById('help-nav').classList.add('off', 'removed');
    let skeleton = document.getElementById('skeleton-wrapper');
    skeleton.addEventListener('transitionend', removeElem, {once: true});
    skeleton.classList.add('off-cheat');
}

function updateSavingsBar(iteration, op, heightMod, currentChartState) {
    let bar = document.getElementById('savings-bar-' + iteration),
        scaleXVal,
        scaleYVal;
    if (op === 1) {
        scaleXVal = 1;
        scaleYVal = 1;
    } else if (op === -1) {
        op = -op;
    } else if (op === 0) {
        scaleXVal = 0.8;
        if (bar.id > 26) {
            scaleYVal = 0.86;
        } else if (bar.id > 21) {
            scaleYVal = 0.83;
        } else if (bar.id < 16) {
            scaleYVal = 0.8;
        } else if (bar.id  < 10) {
            scaleYVal = 0.75;
        } else if (bar.id < 5) {
            scaleYVal = 0.67;
        } else {
            scaleYVal = 0.5;
        }
    }
    if (heightMod > 0 && currentChartState !== 0) {
        let height = document.getElementById('savings-bar-' + iteration).getBBox().height;
        scaleYVal = ((height + 20)/height);
        let tween = new TweenMax.to(bar, 1, {opacity: op, scaleX: scaleXVal, scaleY: scaleYVal, transformOrigin:"center top"});
        return tween;
    } else if (heightMod < 0) {
        scaleYVal = 1;
        let tween = new TweenMax.to(bar, 1, {opacity: op, scaleX: scaleXVal, scaleY: scaleYVal, transformOrigin:"center top"});
        return tween;
    } else {
        let tween = new TweenMax.to(bar, 1, {opacity: op, scaleX: scaleXVal, scaleY: scaleYVal, transformOrigin:"center top"});
        return tween;
    }
}

//GOTTA CHANGE THIS BACK TO THE NUMBER IN THE CODE
var durationVar = 0.6;

function addSavingsBars(currentBar, previousBar, durationMultiplier, currentChartState) {
    let timeline = new TimelineMax();
    for (let i = previousBar; i <= currentBar; i++) {
        if (i === 0) {
            continue;
        } else if (i === previousBar) {
            if (i === 11) {
                timeline.add(updateSavingsBar(i, -1, 0, currentChartState)); 
            } else {
                timeline.add(updateSavingsBar(i, -1, -20, currentChartState));
            }
        } else if (i === currentBar) {
            if (i === 11) {
                timeline.add(updateSavingsBar(i, 1, 0, currentChartState));
            } else {
                timeline.add(updateSavingsBar(i, 1, 20, currentChartState));
            }
        } else {
            timeline.add(updateSavingsBar(i, 1, 0, currentChartState));                
        }
    }
    let timeLength = Math.min((-durationVar * durationMultiplier), 1.2);
    timeline.duration(timeLength);
    timeline.tweenTo(timeline.duration(), {ease: Power1.easeOut, onComplete: addListener});
}

function removeSavingsBars(currentBar, previousBar, durationMultiplier) {
    let timeline = new TimelineMax();
    for (let i = previousBar; i >= currentBar; i--) {
        if (i === 0) {
            continue;
        } else if (i === previousBar) {
            if (i === 11) {
                timeline.add(updateSavingsBar(i, 0, 0));
            } else {
                timeline.add(updateSavingsBar(i, 0, -20));
            }
        } else if (i === currentBar) {
            if (i === 11) {
                timeline.add(updateSavingsBar(i, -1, 0));
            } else {
                timeline.add(updateSavingsBar(i, -1, 20));
            }
        } else {                
            timeline.add(updateSavingsBar(i, 0, 0));
        }
    }
    let timeLength = Math.min((durationVar * durationMultiplier), 1.2);
    timeline.duration(timeLength);
    // timeline.duration(durationVar * durationMultiplier);
    timeline.tweenTo(timeline.duration(), {ease: Power1.easeOut, onComplete: addListener});
}

// NOTEBENE addCostBars and removeCostBars can be compressed into one function with some logic
function addCostBars(currentBar, previousBar, durationMultiplier) {
    let timeline = new TimelineMax();
    for (let i = previousBar + 1; i <= currentBar; i++) {
        let bar = document.getElementById('cost-bar-' + (i));
        let tween = TweenMax.to(bar, 1, {scaleY: 1, transformOrigin:"center bottom"});
        timeline.add(tween);
    }
    let timeLength = Math.min((durationVar * durationMultiplier), 1.2);
    timeline.duration(timeLength);
    // timeline.duration(durationVar * durationMultiplier);
    timeline.tweenTo(timeline.duration(), {ease: Power2.easeOut});
}

function removeCostBars(currentBar, previousBar, durationMultiplier) {
    let timeline = new TimelineMax();
    for (let i = previousBar; i > currentBar; i--) {
        if (i === 0) {
            continue;
        }
        let bar = document.getElementById('cost-bar-' + (i));
        let tween = TweenMax.to(bar, 1, {scaleY: 0});
        timeline.add(tween);
    }
    let timeLength = Math.min((-durationVar * durationMultiplier), 1.2);
    timeline.duration(timeLength);
    // timeline.duration(-durationVar * durationMultiplier);
    timeline.tweenTo(timeline.duration(), {ease: Power2.easeOut});
}

let previousState = {
    "previousChartState": 0,
    "previousCostBar": 6,
    "previousSavingsBar": 31,
    "previousStepNumber": 0,
    "previousDiversionNumber": 0
};

function changeUp() {
    let currentChartState = 0,
        currentCostBar = 6,
        currentSavingsBar = 31,
        currentDiversionNumber = 0,
        currentStepNumber = 0,
        stateCheck = 3;
    chartOn = false;
    chartLabels(currentCostBar, currentSavingsBar);
    stepChange(currentDiversionNumber, previousState.previousDiversionNumber, currentStepNumber, previousState.previousStepNumber);
    addSavingsBars(currentSavingsBar, previousState.previousSavingsBar, -stateCheck, currentChartState);
    addCostBars(currentCostBar, previousState.previousCostBar, stateCheck);
    document.getElementById('info-box').classList.add('off', 'removed');
    document.getElementById('diversions').removeEventListener('click', diversion);
    // document.getElementById('diversions').addEventListener('click', backToDiversions, {once: true});
    document.getElementById('help-nav').classList.remove('off', 'removed');
    document.getElementById('skeleton-wrapper').classList.remove('removed');
    requestAnimationFrame(function(){
        document.getElementById('skeleton-wrapper').classList.remove('off-cheat');
    });
    document.getElementById('main-wrapper').addEventListener('click', backToDiversions, {once: true});
    document.getElementById('main-wrapper').classList.add('clicky');
}

document.getElementById('nav-help').addEventListener('click', changeUp);

function chartLabels(currentCostBar, currentSavingsBar) {
    if (currentCostBar === 0 && currentSavingsBar === 0) {
        document.querySelectorAll('.cost-savings__title').forEach(function(elem){
            elem.classList.add('off');
        });
    } else if (currentCostBar === 6 && currentSavingsBar === 31) {
        document.querySelectorAll('.cost-savings__title').forEach(function(elem){
            elem.classList.add('off');
        });
    } else {
        document.querySelectorAll('.cost-savings__title').forEach(function(elem){
            elem.classList.remove('off');
        });
        if (currentCostBar === 0) {
            document.getElementById('total-cost').classList.add('cost-savings__title--gray');
        } else {
            document.getElementById('total-cost').classList.remove('cost-savings__title--gray');
        }
        if (currentSavingsBar === 0) {
            document.getElementById('savings').classList.add('cost-savings__title--gray');
        } else {
            document.getElementById('savings').classList.remove('cost-savings__title--gray');
        }
    }
}

function diversion(e) {
    if (e.target.tagName === 'A') {
        let currentChartState = parseInt(e.target.dataset.state),
            stateCheck = currentChartState - previousState.previousChartState,
            currentCostBar = currentChartState - Math.round(1/currentChartState),
            currentSavingsBar = 31 - (currentCostBar * 5) - Math.round(currentCostBar * 0.1),
            currentDiversionNumber,
            currentStepNumber,
            target = e.target;
            console.log('currentChartState: ' + currentChartState + " state check: " + stateCheck);
            if (target.id === 'restorative-lawyering') {
                currentDiversionNumber = 7;
            } else {
                currentDiversionNumber = currentChartState;
            }
            if (currentChartState < 3) {
                currentStepNumber = currentDiversionNumber;
            } else {
                currentStepNumber = currentDiversionNumber + 1;
                console.log('currentStepNumber: ' + currentStepNumber);
            }
        if (stateCheck > 0) {
            console.log('to right');
            console.log('currentStepNumber 2: ' + currentStepNumber);
            console.log('currentDiversionNumber: ' + currentDiversionNumber);
            chartLabels(currentCostBar, currentSavingsBar)
            stepChange(currentDiversionNumber, previousState.previousDiversionNumber, currentStepNumber, previousState.previousStepNumber);
            diversionInfo(target);
            removeSavingsBars(currentSavingsBar, previousState.previousSavingsBar, stateCheck);
            addCostBars(currentCostBar, previousState.previousCostBar, stateCheck);
            // grayOutDiversion(currentDiversionNumber, previousState.previousDiversionNumber);
        } else if (stateCheck < 0) {
            console.log('to left');
            console.log('currentStepNumber 2: ' + currentStepNumber);
            console.log('currentDiversionNumber: ' + currentDiversionNumber);
            chartLabels(currentCostBar, currentSavingsBar);
            stepChange(currentDiversionNumber, previousState.previousDiversionNumber, currentStepNumber, previousState.previousStepNumber);
            diversionInfo(target);
            addSavingsBars(currentSavingsBar, previousState.previousSavingsBar, stateCheck);
            // grayOutDiversion(currentDiversionNumber, previousState.previousDiversionNumber);
            if (previousState.previousChartState === 7) {
                //used negative stateCheck value for duration formula to work as intended
                addCostBars(currentCostBar, previousState.previousCostBar, -stateCheck);
            } else {
                removeCostBars(currentCostBar, previousState.previousCostBar, stateCheck);
            }
        } else if (stateCheck === 0) {
            if (currentStepNumber !== previousState.previousStepNumber) {
                stepChange(currentDiversionNumber, previousState.previousDiversionNumber, currentStepNumber, previousState.previousStepNumber);
                diversionInfo(target);
            }
            addListener();
        } else {
            console.log("ERROR!");
        }
        previousState.previousChartState = currentChartState;
        previousState.previousCostBar = currentCostBar;
        previousState.previousSavingsBar = currentSavingsBar;
        previousState.previousStepNumber = currentStepNumber;
        previousState.previousDiversionNumber = currentDiversionNumber;
    } else {
        addListener();
    }
}

function addListener() {
    if (chartOn) {
        document.getElementById('diversions').addEventListener('click', diversion, {once: true}, false);
    }
}

function removeAni() {
    document.getElementById('header-title').classList.remove('header__title--animating');
}

document.getElementById('header-title').addEventListener('transitionend', removeAni, false);

document.getElementById('explore-diversions-link').addEventListener('click', exploreDiversions);

function stepChange(currentDiversion, previousDiversion, currentStep, previousStep) {
    //UPDATE DIVERSION BOXES
    console.log('STEP CHANGE');
    if (currentDiversion > 0) {
        document.getElementById('diversion-' + currentDiversion).classList.add('off');
    }
    if (previousDiversion > 0) {
        document.getElementById('diversion-' + previousDiversion).classList.remove('off');
    }
    //UPDATE STEP BOXES
    if (currentStep > previousStep) {
        for (let i = previousStep; i <= currentStep; i++) {
            if (i === 0) {
                console.log("skip 0");
                continue;
            }
            let step = document.getElementById('step-' + i);
            step.classList.add('off');
        }
    } else {
        for (let i = previousStep; i > currentStep; i--) {
            let step = document.getElementById('step-' + i);
            step.classList.remove('off');
        }
    }
    
    // DEAL WITH IRREGULARITIES
    console.log('previousDiversion: ' + previousDiversion);
    if (currentDiversion !== 4 && currentDiversion !== 7 && currentDiversion !== 0) {
        document.getElementById('step-left-' + (currentStep)).classList.add('on');
        document.getElementById('diversion-left-' + (currentDiversion)).classList.add('on');
    }
    if (previousDiversion !== 4 && previousDiversion !== 7 && previousDiversion !== 0) {
        console.log('remove black');
        document.getElementById('diversion-left-' + (previousDiversion)).classList.remove('on');
        document.getElementById('step-left-' + (previousStep)).classList.remove('on');
    }
    if (currentDiversion < 3 && currentDiversion !== 0) {
        document.getElementById('diversion-top-' + (currentDiversion)).classList.add('on');
    }
    if (previousDiversion < 3 && previousDiversion !== 0) {
        document.getElementById('diversion-top-' + (previousDiversion)).classList.remove('on');
    }
}

function diversionInfo(target) {
    let infoBox = document.getElementById('info-box'),
        title = document.getElementById('info-box-title'),
        bullets = document.getElementById('info-box-bullets'),
        moreInfo = document.getElementById('info-box-more'),
        name = target.firstElementChild.textContent;
    title.textContent = target.firstElementChild.textContent;
    name = name.toLowerCase();
    console.log('diversion name: ' + name);
    document.getElementById('x-box').style.backgroundColor = dataPayload[name]["color"];
    document.getElementById('more-info').style.backgroundColor = dataPayload[name]["color"];
    while (bullets.firstChild) {
        bullets.removeChild(bullets.firstChild);
    }
    while (moreInfo.firstChild) {
        moreInfo.removeChild(moreInfo.firstChild);
    }
    let dataBullets = dataPayload[name]['bullets'],
        dataParagraphs = dataPayload[name]['paragraphs'];
    for (let x in dataBullets) {
        let bullet = document.createElement('li');
        bullet.classList.add('info-box__bullet');
        console.log('THE VALUE IS: ' + dataBullets[x]);
        bullet.textContent = dataBullets[x];
        bullets.appendChild(bullet);
    }
    for (let x in dataBullets) {
        let parapgraph = document.createElement('p');
        parapgraph.classList.add('info-box__bullet');
        parapgraph.textContent = dataParagraphs[x];
        moreInfo.appendChild(parapgraph);
    }
    if (infoBox.classList.contains('off')) {
        infoBox.classList.remove('off');
    }
}

document.getElementById('more-info').addEventListener('click', learnMore, {once: true});

function learnMore() {
    document.getElementById('info-box').classList.add('info-box--expanded');
    document.getElementById('more-info-title').textContent = 'SHOW LESS';
    document.getElementById('info-box-arrow').classList.add('info-box__arrow--flipped');
    document.getElementById('more-info').addEventListener('click', learnLess, {once: true});
}

function learnLess() {
    document.getElementById('info-box').classList.remove('info-box--expanded');
    document.getElementById('more-info-title').textContent = 'LEARN MORE';
    document.getElementById('info-box-arrow').classList.remove('info-box__arrow--flipped');
    document.getElementById('more-info').addEventListener('click', learnMore, {once: true});
}

let dataPayload = {
    "pre-arrest diversion": {
        "color": "#428EAA",
        "bullets": {
            "1": "1 Million misdemeanor arrests each year",
            "2": "Police make an average of $53/hour"
        },
        "paragraphs": {
            "1": "Pre-arrest (or pre-booking) diversion provides a mechanism by which first responders and law enforcement can assess the needs of offenders and determine that diversion is appropriate given those needs. People who commit crimes and are diverted pre-arrest do not spend time in jail, appear in court, or retain a lawyer.",
            "2": "Once a pre-arrest diversion is invoked, offenders are directed to services and support that are specifically designed to meet their needs as opposed to sending an offender to jail or issuing a court summons. Pre-Arrest Diversion often does not result in the generation of an arrest report for law enforcement. At this early stage, pre-arrest diversion saves enormous amount of money for all stakeholders and reduces further burdensome contact with the law. If an offender has contact with law enforcement and is not diverted, an arrest report is generated and transmitted to the local prosecuting agency to decide whether to file charges."
        }
    },
    "pre-charge diversion": {
        "color": "#4E71D3",
        "bullets": {
            "1": "Each arraignment costs an average of $1,500",
            "2": "95% of defendants plead guilty"
        },
        "paragraphs": {
            "1": "At this stage, the offender can be diverted pre-charge (or pre-filing) by the prosecuting agency after a determination is made that the offender meets certain eligibility criteria set by the prosecuting agency (often low-level, non-violent, first-time offenders).  Offenders typically must admit guilt in order to participate in pre-charge diversion. If they are diverted pre-charge, they generally do not appear in court or retain a lawyer.",
            "2": "Pre-charge diversion programs can take many different forms, the most interesting of which being where the offender meets with local stakeholders (not law enforcement or lawyers) where they discuss why the crime was committed, what the effects of it were, and how to make it right going forward. Pre-charge diversion prevents the criminal case from being calendared, thereby avoiding arraignment and any further court appearances. However, because the prosecuting agency holds on to the case while the offender participates in the diversion program, if the offender fails to complete the program, the prosecutor may still file charges against them."
        }
    },
    "pre-trial diversion": {
        "color": "#895CBD",
        "bullets": {
            "1": "It costs $100/day the defendant is in custody",
            "2": "Pre-trial divsersions are led and and monitored by judges"
        },
        "paragraphs": {
            "1": "Pre-trial diversion is an option usually provided by the judge; by entering a guilty plea, the judge may offer to defer an entry of judgment (DEJ) against the defendant so she may complete certain obligations that the judge imposes in lieu of the traditional hallmarks of a guilty plea (court fines and fees, a criminal record, court ordered community service, and sometimes even jail time).",
            "2": "When an offender is called to arraignment and pleads the charge (guilty or not guilty), they become a defendant in the criminal justice system. At this late stage, they may still be diverted before proceedings move forward and a trial is a commenced. Pre-trial diversion is almost always associated with low-level crimes, particularly drug crimes. The conditions that the judge may impose upon the defendant is limited only to the resources and knowledge available to the judge, which puts a greater burden on the judge to become aware about what services are available and what approaches are effective for a particular defendant or crime. Upon completion of the obligations imposed upon the judge, the case is dismissed."
        }
    },
    "specialty courts": {
        "color": "#D34F81",
        "bullets": {
            "1": "Some bulleted information",
            "2": "Some more bulleted information"
        },
        "paragraphs": {
            "1": "Many jurisdictions operate specialty courts (sometimes known as collaborative courts or problem-solving courts) that deal with a specific type of defendant. Diversion to specialty courts often occurs at arraignment, where a traditional judge identifies that the defendant may be eligible for participation in a specialty court, at which point the case is transferred.",
            "2": "Specialty courts are designed to serve a particular class of defendant; there are homeless courts, drug courts, veterans courts, mental health courts, among others. While specialty courts often have all the trappings of a regular court (judge, bailiff, court reporter, prosecutor, and defender), they also may have additional personnel such as social workers and case managers, who encourage an equitable resolution of the case by referral to service providers, healthcare, and mental health treatment. Specialty courts often require defendants to appear much more frequently than regular courts to remain apprised of the defendant’s progress. While specialty courts require the (sometimes costly) participation of many stakeholders inside and out of the traditional criminal justice system, defendant outcomes are often much better than traditional criminal justice. Conversely, many defendants often choose to plead guilty and walk of court rather than to spend up to a year reporting to a specialty court, which retains jurisdiction over the case during that time."
        }
    },
    "restorative sentencing": {
        "color": "#D95B4A",
        "bullets": {
            "1": "Housing inmates in state prisons costs $60,000/year",
            "2": "Some bulleted information"
        },
        "paragraphs": {
            "1": "State court judges have tremendous power during the sentencing phase of a criminal case to craft unique obligations that the defendant must complete as a part of their sentence.",
            "2": "Judges may apply restorative techniques in crafting and handing down sentences, although this option is often limited by the judge's understanding of restorative or other approaches to wrongdoing and their willingness to try something different than what the sentencing guidelines in their jurisdiction might suggest."
        }
    },
    "restorative prison programming": {
        "color": "#CE2C54",
        "bullets": {
            "1": "Some bulleted information",
            "2": "Some more bulleted information"
        },
        "paragraphs": {
            "1": "Depending on the prison, inmates may have the opportunity to reflect on their crime and their lives while also gaining new skills to prepare them for their return to society.",
            "2": "Since the ‘90s, the availability of any prison programming has dramatically decreased, to the point where there is very little that prisoners can do in the way of gaining real training for the outside world or insight into their crime and criminality."
        }
    },
    "restorative lawyering": {
        "color": "#4A4C3F",
        "bullets": {
            "1": "Some bulleted information",
            "2": "Some more bulleted information"
        },
        "paragraphs": {
            "1": "P1",
            "2": "P2"
        }
    }
}

function removeNav(e) {
    e.target.classList.add('removed');
}

function showWhatsBox() {
    let whatsDiversionBox = document.getElementById('whats-diversion');
    whatsDiversionBox.classList.remove('removed');
    whatsDiversionBox.classList.remove('off');
}

function whatsDiversion() {
    //CODE REPEAT
    let title = document.getElementById('header-title'),
        logo = document.getElementById('logo'),
        nav = document.getElementById('nav'),
        landingNav = document.getElementById('landing-nav');
    landingNav.addEventListener('transitionend', removeNav, {once: true});
    // logo.classList.remove('off');
    // nav.classList.remove('off');
    landingNav.classList.add('landing-nav--off');
    // title.classList.add('header__title--animating');
    // title.classList.add('header__title--left');

    landingNav.addEventListener('transitionend', showWhatsBox, {once: true});

    previousState.previousChartState = 7;
    previousState.previousCostBar = 0;
    previousState.previousSavingsBar = 0;
    previousState.previousStepNumber = 0;
    previousState.previousDiversionNumber = 0;
}

document.getElementById('whats-diversion-link').addEventListener('click', whatsDiversion, {once: true});

function removeElemCheat(e) {
    document.getElementById('whats-diversion').classList.add('off');
    document.getElementById('whats-diversion').classList.remove('off-cheat');
    e.target.classList.add('removed');
    document.getElementById('info-box').classList.remove('removed');
}

// let title = document.getElementById('header-title'),
//         logo = document.getElementById('logo'),
//         nav = document.getElementById('nav'),
//         landingNav = document.getElementById('landing-nav'),
//         skeleton = document.getElementById('skeleton-wrapper');
//     // landingNav.addEventListener('transitionend', removeElem);
//     landingNav.addEventListener('transitionend', addInfoBox);
//     landingNav.classList.add('landing-nav--off');
//     landingNav.addEventListener('transitionend', removeElem);
//     logo.classList.remove('off');
//     nav.classList.remove('off');
//     title.classList.add('header__title--animating');
//     title.classList.add('header__title--left');
//     skeleton.addEventListener('transitionend', removeElem);
//     skeleton.classList.add('off-cheat');
//     let elem = document.getElementById('step-1');
//     let style = window.getComputedStyle(elem, null);
//     chartOn = true;
//     hideSavings();
//     hideCost();
//     previousState.previousChartState = 7;
//     previousState.previousCostBar = 0;
//     previousState.previousSavingsBar = 0;
//     previousState.previousStepNumber = 0;
//     previousState.previousDiversionNumber = 0;

function whatsDiversionExplore() {
    //CODE REPEAT
    let title = document.getElementById('header-title'),
        logo = document.getElementById('logo'),
        nav = document.getElementById('nav'),
        landingNav = document.getElementById('whats-diversion'),
        skeleton = document.getElementById('skeleton-wrapper');
    // landingNav.addEventListener('transitionend', removeElem);
    landingNav.addEventListener('transitionend', addInfoBox);
    landingNav.classList.add('landing-nav--off');
    landingNav.addEventListener('transitionend', removeElem);
    logo.classList.remove('off');
    nav.classList.remove('off');
    title.classList.add('header__title--animating');
    title.classList.add('header__title--left');
    skeleton.addEventListener('transitionend', removeElem, {once: true});
    skeleton.classList.add('off-cheat');
    hideSavings();
    hideCost();
    previousState.previousChartState = 7;
    previousState.previousCostBar = 0;
    previousState.previousSavingsBar = 0;
    previousState.previousStepNumber = 0;
    previousState.previousDiversionNumber = 0;
    chartOn = true;
    document.getElementById('footer').classList.remove('hidden');
    document.getElementById('footer').classList.remove('off-cheat');
    document.getElementById('whats-diversion').addEventListener('transitionend', removeElemCheat, {once: true});
    document.getElementById('whats-diversion').classList.add('off-cheat');
}

document.getElementById('whats-diversion-explore').addEventListener('click', whatsDiversionExplore, {once: true});
