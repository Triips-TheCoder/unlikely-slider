const noop = () => null;

class RosaAnimationEngine {
    #lastUpdate;
    #deltaTime;
    #frameID;
    #pauseStart;
    #pausedTime;
    #callbacks = [];
    #runningAnimations;
    static #instance;
    static getInstance() {
        if (!RosaAnimationEngine.#instance)
            RosaAnimationEngine.#instance = new RosaAnimationEngine();
        return RosaAnimationEngine.#instance;
    }
    constructor() {
        this.#runningAnimations = new Map();
        this.#lastUpdate = 0;
        this.#deltaTime = 0;
        this.#frameID = 0;
        this.#pauseStart = 0;
        this.#pausedTime = 0;
    }
    enqueuAnimation(element) {
        this.#isAlreadyAnimate(element);
        this.#runningAnimations.set(element.getDomElement, {
            animatedElement: element,
            templateTweener: element.getTemplate
        });
    }
    #isAlreadyAnimate(element) {
        this.#runningAnimations.has(element.getDomElement) ? this.#runningAnimations.delete(element.getDomElement) : noop();
    }
    start() {
        this.#lastUpdate = performance.now();
        this.#startLoop();
    }
    #startLoop() {
        const loop = (timestampInMs) => {
            this.#frameID = requestAnimationFrame(loop);
            this.#callbacks.forEach((callback) => callback(timestampInMs));
            this.#update(timestampInMs);
            this.#draw();
        };
        requestAnimationFrame(loop);
    }
    #update(timestampInMs) {
        let time = timestampInMs;
        this.#deltaTime = time - this.#lastUpdate;
        this.#lastUpdate = time;
        time -= this.#pausedTime;
        if (this.#noAnimationsRunning())
            return;
        Array.from(this.#runningAnimations.values()).forEach(({ animatedElement }) => {
            animatedElement.getHasAnimationFinished ? this.#runningAnimations.delete(animatedElement.getDomElement) : animatedElement.update(time);
        });
    }
    #draw() {
        if (this.#noAnimationsRunning())
            return;
        this.#runningAnimations.forEach(({ animatedElement }) => animatedElement.draw());
    }
    pause() {
        this.#pauseStart = performance.now();
        cancelAnimationFrame(this.#frameID);
    }
    resume() {
        this.#pausedTime += performance.now() - this.#pauseStart;
        requestAnimationFrame(this.start.bind(this));
    }
    #noAnimationsRunning() {
        return this.#runningAnimations.size === 0;
    }
    cleanPause() {
        this.#pausedTime = 0;
        this.#pauseStart = 0;
    }
    get getPausedTime() {
        return this.#pausedTime;
    }
    get getRunningAnimations() {
        return this.#runningAnimations;
    }
    enqueuCallback(callback) {
        this.#callbacks.push(callback);
    }
}
const SINGLETON_ROSA = Object.freeze(RosaAnimationEngine.getInstance());

const helper = {
    isArray: (value) => Array.isArray(value),
    isString: (value) => typeof value === "string",
    strings: (...values) => {
        let isAllValuesAreString = [];
        values.forEach((value) => typeof value === "string" ? isAllValuesAreString.push(true) : isAllValuesAreString.push(false));
        return isAllValuesAreString.every((bool) => bool);
    },
    isSameStrings: (stringToTest, stringToMatch) => stringToTest === stringToMatch,
    isNumber: (value) => typeof value === "number",
    isUndef: (value) => typeof value === "undefined",
    isValidTransform: (value) => {
        const validTransformProperties = /(translate|rotate|skew|scale)(?=[XYZ])/;
        return validTransformProperties.test(value);
    },
    isOpacity: (value) => value === "opacity"
};

const overwriteFromValueOfTweens = (tweens, animationParameters) => {
    const { specificParameters } = animationParameters;
    const parameters = animationParameters;
    const fromValueIndex = 0;
    tweens.forEach((tween) => {
        if (specificParameters) {
            const usePixel = helper.isString(parameters[tween.getPropertyToTween].fromTo[fromValueIndex]);
            parameters[tween.getPropertyToTween].fromTo[fromValueIndex] = usePixel ? tween.getCurrentTweenProgression.toString() : tween.getCurrentTweenProgression;
            const propertyParameters = {
                ...parameters[tween.getPropertyToTween]
            };
            Object.defineProperty(animationParameters, tween.getPropertyToTween, {
                value: propertyParameters,
                writable: false
            });
        }
        else {
            const usePixel = helper.isString(parameters[tween.getPropertyToTween][fromValueIndex]);
            parameters[tween.getPropertyToTween][fromValueIndex] = usePixel ? tween.getCurrentTweenProgression.toString() : tween.getCurrentTweenProgression;
            const fromTo = parameters[tween.getPropertyToTween];
            Object.defineProperty(animationParameters, tween.getPropertyToTween, {
                value: fromTo,
                writable: false
            });
        }
    });
};

const chooseUnit = (value) => {
    const valueAsString = helper.isString(value) ? value : value.toString();
    if (helper.isNumber(value))
        return "%";
    else if (valueAsString.includes("deg"))
        return "deg";
    return "px";
};

const getOnlyNumbers = (sentenceThatContainNumbers) => Number(parseFloat(sentenceThatContainNumbers));

const removeUnit = (from, to) => {
    return {
        fromWithoutUnit: getOnlyNumbers(from),
        toWithoutUnit: getOnlyNumbers(to)
    };
};

class Ease {
    static #instance;
    static getInstance() {
        if (!Ease.#instance)
            Ease.#instance = new Ease();
        return Ease.#instance;
    }
    constructor() {
    }
    inSine(x) {
        return 1 - Math.cos((x * Math.PI) / 2);
    }
    inCubic(x) {
        return x * x * x;
    }
    inQuint(x) {
        return x * x * x * x * x;
    }
    inCirc(x) {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
    }
    inElastic(x) {
        const c4 = (2 * Math.PI) / 3;
        return x === 0
            ? 0
            : x === 1
                ? 1
                : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
    }
    outSine(x) {
        return Math.sin((x * Math.PI) / 2);
    }
    outCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }
    outQuint(x) {
        return 1 - Math.pow(1 - x, 5);
    }
    outCirc(x) {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }
    outElastic(x) {
        const c4 = (2 * Math.PI) / 3;
        return x === 0
            ? 0
            : x === 1
                ? 1
                : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    }
    inOutSine(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }
    inOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
    inOutQuint(x) {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }
    inOutCirc(x) {
        return x < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    }
    inOutElastic(x) {
        const c5 = (2 * Math.PI) / 4.5;
        return x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5
                    ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                    : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
    }
    inQuad(x) {
        return x * x;
    }
    inQuart(x) {
        return x * x * x * x;
    }
    inExpo(x) {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    }
    inBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * x * x * x - c1 * x * x;
    }
    inBounce(x) {
        return 1 - this.outBounce(1 - x);
    }
    outQuad(x) {
        return 1 - (1 - x) * (1 - x);
    }
    outQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }
    outExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }
    outBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
    outBounce(x) {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (x < 1 / d1) {
            return n1 * x * x;
        }
        else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        }
        else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        }
        else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    }
    inOutQuad(x) {
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }
    inOutQuart(x) {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    }
    inOutExpo(x) {
        return x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
                    : (2 - Math.pow(2, -20 * x + 10)) / 2;
    }
    inOutBack(x) {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        return x < 0.5
            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
    }
    inOutBounce(x) {
        return x < 0.5
            ? (1 - this.outBounce(1 - 2 * x)) / 2
            : (1 + this.outBounce(2 * x - 1)) / 2;
    }
}
const SINGLETON_EASE = Object.freeze(Ease.getInstance());

const lerp = (start, end, t) => start + (end - start) * t;

class Tween {
    #propertyToTween;
    #unit;
    #startValue;
    #endValue;
    #duration = 0;
    #ease = "";
    #delay = 0;
    #startOfTween;
    #progress;
    #hasTweenFinished = false;
    #progressMode;
    #currentTweenProgression;
    constructor(propertyToTween, startValue, endValue, unit, isSpecificProgress, duration, ease, delay) {
        this.#propertyToTween = propertyToTween;
        this.#unit = helper.isOpacity(this.#propertyToTween) ? "" : unit;
        this.#startValue = this.#currentTweenProgression = startValue;
        this.#endValue = endValue;
        this.#progress = 0;
        this.#ease = ease ?? this.#ease;
        this.#duration = duration ?? this.#duration;
        this.#delay = delay ?? this.#delay;
        this.#startOfTween = performance.now() + this.#delay - SINGLETON_ROSA.getPausedTime;
        this.#progressMode = isSpecificProgress ? this.#progressMode = this.#specificTweenProgression : this.#progressMode = this.#normalTweenProgression;
    }
    set setProgress(timestampInMs) {
        this.#progressMode(timestampInMs);
    }
    #normalTweenProgression(timestampInMs) {
        this.#progress = timestampInMs;
        this.#currentTweenProgression = lerp(this.#startValue, this.#endValue, this.#progress);
    }
    #specificTweenProgression(timestampInMs) {
        if (this.#progress >= 1)
            this.#hasTweenFinished = true;
        const elasped = timestampInMs - this.#startOfTween;
        if (elasped >= 0) {
            this.#progress = SINGLETON_EASE[this.#ease](Math.min(elasped / this.#duration, 1));
            this.#currentTweenProgression = lerp(this.#startValue, this.#endValue, this.#progress);
        }
    }
    get getProgress() {
        return this.#progress;
    }
    get getStartValue() {
        return this.#startValue;
    }
    get getEndValue() {
        return this.#endValue;
    }
    get getPropertyToTween() {
        return this.#propertyToTween;
    }
    get getUnit() {
        return this.#unit;
    }
    get getIsTweenFinish() {
        return this.#hasTweenFinished;
    }
    get getCurrentTweenProgression() {
        return this.#currentTweenProgression;
    }
}

const convertSecondToMillisecond = (time) => time * 1000;

const createReverseTween = (tweenParameters) => {
    const { property, fromWithoutUnit, toWithoutUnit, hasSpecificParameters, durationInS, unit } = tweenParameters;
    return new Tween(property, toWithoutUnit, fromWithoutUnit, unit, hasSpecificParameters, convertSecondToMillisecond(durationInS));
};
const createNormalTween = (tweenParameters) => {
    const { property, fromWithoutUnit, toWithoutUnit, durationInS, hasSpecificParameters, unit, } = tweenParameters;
    return new Tween(property, fromWithoutUnit, toWithoutUnit, unit, hasSpecificParameters, convertSecondToMillisecond(durationInS));
};
const createNormalTweenWithSpecificParameters = (tweenParameters) => {
    const { property, fromWithoutUnit, toWithoutUnit, unit, hasSpecificParameters, duration, ease, delay, } = tweenParameters;
    return new Tween(property, fromWithoutUnit, toWithoutUnit, unit, hasSpecificParameters, duration, ease, delay);
};
const createReverseTweenWithSpecificParameters = (tweenParameters) => {
    const { property, fromWithoutUnit, toWithoutUnit, unit, hasSpecificParameters, duration, ease, delay, } = tweenParameters;
    return new Tween(property, toWithoutUnit, fromWithoutUnit, unit, hasSpecificParameters, duration, ease, delay);
};
const tweenFactory = (type, tweenParameters) => {
    switch (type) {
        case 'reverse':
            return createReverseTween(tweenParameters);
        case 'normalSpecific':
            return createNormalTweenWithSpecificParameters(tweenParameters);
        case 'reverseSpecific':
            return createReverseTweenWithSpecificParameters(tweenParameters);
        default:
            return createNormalTween(tweenParameters);
    }
};
const createTween = (tweenParameters) => {
    const { hasSpecificParameters, isReverse } = tweenParameters;
    if (hasSpecificParameters && isReverse)
        return tweenFactory('reverseSpecific', tweenParameters);
    else if (hasSpecificParameters)
        return tweenFactory('normalSpecific', tweenParameters);
    else if (isReverse)
        return tweenFactory('reverse', tweenParameters);
    return tweenFactory('normal', tweenParameters);
};

const hasProperty = (object, property) => object.hasOwnProperty(property);

const formatSpecificTweenParameters = (tweenParameters) => {
    const propertyToFormat = ['ease', 'duration', 'delay', 'direction'];
    propertyToFormat.forEach((property, index) => {
        hasProperty(tweenParameters.specificToTheTween, property) ? noop() : tweenParameters.specificToTheTween[property] = tweenParameters.notSpecificToTheTween[index];
        if (property === "duration" || property === 'delay')
            tweenParameters.specificToTheTween[property] = convertSecondToMillisecond(tweenParameters.specificToTheTween[property]);
    });
    const [from, to] = tweenParameters.specificToTheTween.fromTo;
    const unit = chooseUnit(from);
    const { fromWithoutUnit, toWithoutUnit } = removeUnit(from.toString(), to.toString());
    return {
        ...tweenParameters.specificToTheTween,
        fromWithoutUnit,
        toWithoutUnit,
        unit
    };
};

class TemplateTweener {
    #tweens;
    #templateThatWillTween = [];
    #opacity = "";
    #translate3d = "";
    #rotate3d = "";
    #scale3d = "";
    #skew = "";
    #translateX = "0px";
    #translateY = "0px";
    #translateZ = "0px";
    #rotateX = "0";
    #rotateY = "0";
    #rotateZ = "0";
    #scaleX = "1";
    #scaleY = "1";
    #scaleZ = "1";
    #skewX = "0";
    #skewY = "0";
    constructor(tweens) {
        this.#tweens = new Set(tweens);
    }
    updateTemplate() {
        this.#tweens.forEach((tween) => {
            if (tween.getPropertyToTween.includes("rotate")) {
                this.#rotate3d = `rotate3d(
                ${tween.getPropertyToTween === "rotateX" ? this.#rotateX = "1" : this.#rotateX},
                ${tween.getPropertyToTween === "rotateY" ? this.#rotateY = "1" : this.#rotateY},
                ${tween.getPropertyToTween === "rotateZ" ? this.#rotateZ = "1" : this.#rotateZ},
                ${tween.getCurrentTweenProgression + tween.getUnit})`;
            }
            else if (tween.getPropertyToTween.includes("scale")) {
                this.#scale3d = `scale3d(
                ${tween.getPropertyToTween === "scaleX" ? this.#scaleX = tween.getCurrentTweenProgression + "" : this.#scaleX},
                ${tween.getPropertyToTween === "scaleY" ? this.#scaleY = tween.getCurrentTweenProgression + "" : this.#scaleY},
                ${tween.getPropertyToTween === "scaleZ" ? this.#scaleZ = tween.getCurrentTweenProgression + "" : this.#scaleZ})`;
            }
            else if (tween.getPropertyToTween.includes("translate")) {
                this.#translate3d = `translate3d(
                ${tween.getPropertyToTween === "translateX" ? this.#translateX = tween.getCurrentTweenProgression + tween.getUnit : this.#translateX},
                ${tween.getPropertyToTween === "translateY" ? this.#translateY = tween.getCurrentTweenProgression + tween.getUnit : this.#translateY},
                ${tween.getPropertyToTween === "translateZ" ? this.#translateZ = tween.getCurrentTweenProgression + tween.getUnit : this.#translateZ})`;
            }
            else if (tween.getPropertyToTween.includes("skew")) {
                this.#skew = `skew(
                ${tween.getPropertyToTween === "skewX" ? this.#skewX = tween.getCurrentTweenProgression + tween.getUnit : this.#skewX},
                ${tween.getPropertyToTween === "skewY" ? this.#skewY = tween.getCurrentTweenProgression + tween.getUnit : this.#skewY})`;
            }
            else if (tween.getPropertyToTween.includes('opacity')) {
                this.#opacity = `${tween.getCurrentTweenProgression}`;
            }
        });
        this.#templateThatWillTween = [`${this.#translate3d} ${this.#scale3d} ${this.#rotate3d} ${this.#skew}`, `${this.#opacity}`];
    }
    get getTemplateThatWillTween() {
        return this.#templateThatWillTween;
    }
    get getTweens() {
        return this.#tweens;
    }
}

class AnimatedElement {
    #domElement;
    #direction = "normal";
    #duration = 0;
    #delay = 0;
    #ease = "";
    #startOfAnimation;
    #elapsed = 0;
    #progress;
    #hasAnimationFinished = false;
    #template;
    #updateMode;
    #cssProperties = ['transform'];
    #onFinishCallback;
    constructor(element, template, isSpecificUpdate, onFinishCallback, ease, duration, delay, direction, hasOpacity) {
        this.#elapsed = 0;
        this.#progress = 0;
        this.#domElement = element;
        this.#template = template;
        this.#ease = ease ?? this.#ease;
        this.#duration = duration ?? this.#duration;
        this.#delay = delay ?? this.#delay;
        this.#direction = direction ?? this.#direction;
        this.#startOfAnimation = performance.now() + this.#delay - SINGLETON_ROSA.getPausedTime;
        this.#updateMode = isSpecificUpdate ? this.#updateMode = this.#specificUpdate : this.#updateMode = this.#normalUpdate;
        this.#onFinishCallback = onFinishCallback ? onFinishCallback : null;
        hasOpacity ? this.#cssProperties.push('opacity') : noop();
    }
    update(timestampInMs) {
        this.#updateMode(timestampInMs);
    }
    #specificUpdate(timestampInMs) {
        this.#template.getTweens.forEach((tween) => {
            if (tween.getIsTweenFinish) {
                this.#template.getTweens.delete(tween);
                if (this.#template.getTweens.size === 0) {
                    this.#hasAnimationFinished = true;
                    this.#onFinishCallback ? this.#onFinishCallback() : noop();
                }
            }
            tween.setProgress = timestampInMs;
        });
    }
    #normalUpdate(timestampInMs) {
        this.#elapsed = timestampInMs - this.#startOfAnimation;
        if (this.#elapsed >= 0) {
            this.#progress = SINGLETON_EASE[this.#ease](Math.min(this.#elapsed / this.#duration, 1));
            this.#template.getTweens.forEach((tween) => tween.setProgress = this.#progress);
        }
    }
    draw() {
        if (this.#progress >= 1) {
            this.#hasAnimationFinished = true;
            this.#onFinishCallback ? this.#onFinishCallback() : noop();
        }
        this.#template.updateTemplate();
        this.#updateDom();
    }
    #updateDom() {
        this.#cssProperties.forEach((property, index) => {
            const domStyle = this.#domElement.style;
            domStyle[property] = this.#template.getTemplateThatWillTween[index];
        });
    }
    get getHasAnimationFinished() {
        return this.#hasAnimationFinished;
    }
    get getDomElement() {
        return this.#domElement;
    }
    get getTemplate() {
        return this.#template;
    }
}

const stopAnimationOnTabLeft = () => {
    let hasLeftTab = false;
    document.addEventListener("visibilitychange", () => {
        hasLeftTab = !hasLeftTab;
        if (hasLeftTab)
            SINGLETON_ROSA.pause();
        else
            SINGLETON_ROSA.resume();
    });
};

const rosaX = ({ ...animationParameters }) => {
    const tweens = new Set();
    const { node, duration, delay, ease, direction, specificParameters = false, opacity = false, onFinish } = animationParameters;
    const runningAnimation = SINGLETON_ROSA.getRunningAnimations;
    const isAlreadyAnimate = runningAnimation.has(node);
    if (isAlreadyAnimate) {
        const nodeTweens = runningAnimation.get(node).templateTweener.getTweens;
        overwriteFromValueOfTweens(nodeTweens, animationParameters);
    }
    const defaultParameters = {
        duration: 1,
        delay: 0,
        ease: "out",
        direction: "normal"
    };
    const hasOpacity = opacity ? true : false;
    const durationInS = helper.isUndef(duration) ? defaultParameters.duration : duration;
    const delayInS = helper.isUndef(delay) ? defaultParameters.delay : delay;
    const animationEase = helper.isUndef(ease) ? defaultParameters.ease : ease;
    const isReverse = helper.isSameStrings(direction, 'reverse');
    const directionForSpecificParameters = direction ?? defaultParameters.direction;
    for (const [property, value] of Object.entries(animationParameters)) {
        let hasSpecificParameters = false;
        if (helper.isValidTransform(property) || helper.isOpacity(property)) {
            if (helper.isArray(value)) {
                const [from, to] = value;
                const unit = chooseUnit(from);
                const { fromWithoutUnit, toWithoutUnit } = removeUnit(from.toString(), to.toString());
                const tweenParameters = {
                    property,
                    unit,
                    fromWithoutUnit,
                    toWithoutUnit,
                    durationInS,
                    hasSpecificParameters,
                    isReverse,
                };
                tweens.add(createTween({
                    ...tweenParameters,
                    fromWithoutUnit,
                    toWithoutUnit
                }));
            }
            else {
                hasSpecificParameters = true;
                const specificTweenParameters = value;
                const animationParameters = [animationEase, durationInS, delayInS, directionForSpecificParameters];
                const specificTweenParametersFormated = formatSpecificTweenParameters({
                    notSpecificToTheTween: animationParameters,
                    specificToTheTween: specificTweenParameters
                });
                const isReverse = helper.isSameStrings(specificTweenParametersFormated.direction, 'reverse');
                tweens.add(createTween({
                    ...specificTweenParametersFormated,
                    property,
                    hasSpecificParameters,
                    isReverse
                }));
            }
        }
    }
    const template = new TemplateTweener(tweens);
    const element = specificParameters ? new AnimatedElement(node, template, specificParameters, onFinish) : new AnimatedElement(node, template, specificParameters, onFinish, animationEase, convertSecondToMillisecond(durationInS), convertSecondToMillisecond(delayInS), direction, hasOpacity);
    SINGLETON_ROSA.enqueuAnimation(element);
    return element;
};
SINGLETON_ROSA.start();
stopAnimationOnTabLeft();
Array.from(document.querySelectorAll(".circle"));
const timeline = {
    add: (animationParameters) => {
        rosaX(animationParameters);
        return timeline;
    }
};

export { rosaX as default, timeline };
