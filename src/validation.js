const validation = (newValue, min, max, setError, uiToBase, baseToUI) => {
    if (isNaN(newValue)) {
        setError('Bitte geben Sie eine Zahl ein');
        return false;
    }
    newValue = uiToBase(newValue);
    if ((min && newValue * 1 < min * 1) || (max && newValue * 1 > max * 1)) {
        setError('nur Werte zwischen ' + baseToUI(min) + ' und ' + baseToUI(max) + ' sind möglich');
        return false;
    }
    return true;
};


export default { validation };