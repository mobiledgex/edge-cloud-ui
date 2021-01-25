export const resetFormValue = (form) => {
    let rules = form.rules
    if (rules) {
        let disabled = rules.disabled ? rules.disabled : false
        if (!disabled) {
            form.value = undefined;
        }
    }
}