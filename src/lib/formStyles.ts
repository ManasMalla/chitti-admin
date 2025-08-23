// Consistent form styling for the entire application
export const formStyles = {
  container: `
    max-width: 600px;
    margin: 20px auto;
    padding: 24px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 2px 4px var(--shadow);
    background-color: var(--bg-primary);
    color: var(--text-primary);
    font-family: "Poppins", sans-serif;
  `,
  
  title: `
    text-align: center;
    margin-bottom: 24px;
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 24px;
    font-family: "Poppins", sans-serif;
  `,
  
  form: `
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  
  formGroup: `
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,
  
  label: `
    font-weight: 600;
    color: var(--text-secondary);
    font-family: "Poppins", sans-serif;
    font-size: 14px;
  `,
  
  input: `
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 16px;
    font-family: "Poppins", sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
    box-sizing: border-box;
  `,
  
  textarea: `
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 16px;
    font-family: "Poppins", sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
    min-height: 100px;
  `,
  
  select: `
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 16px;
    font-family: "Poppins", sans-serif;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
  `,
  
  button: `
    padding: 12px 24px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    font-family: "Poppins", sans-serif;
    transition: background-color 0.2s ease, transform 0.1s ease;
    width: 100%;
  `,
  
  buttonHover: `
    background-color: var(--primary-hover, #d45e05);
    transform: translateY(-1px);
  `,
  
  buttonDisabled: `
    background-color: #6c757d;
    cursor: not-allowed;
    transform: none;
  `,
  
  successMessage: `
    background-color: var(--success-bg);
    color: var(--success-text);
    border: 1px solid var(--success-border);
    padding: 12px;
    border-radius: 6px;
    font-family: "Poppins", sans-serif;
    text-align: center;
  `,
  
  errorMessage: `
    background-color: var(--error-bg);
    color: var(--error-text);
    border: 1px solid var(--error-border);
    padding: 12px;
    border-radius: 6px;
    font-family: "Poppins", sans-serif;
    text-align: center;
  `,
  
  focus: `
    outline: none;
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  `
};

// CSS-in-JS helper function
export const createFormStyles = () => {
  return `
    .form-container {
      ${formStyles.container}
    }
    
    .form-title {
      ${formStyles.title}
    }
    
    .form {
      ${formStyles.form}
    }
    
    .form-group {
      ${formStyles.formGroup}
    }
    
    .form-label {
      ${formStyles.label}
    }
    
    .form-input {
      ${formStyles.input}
    }
    
    .form-textarea {
      ${formStyles.textarea}
    }
    
    .form-select {
      ${formStyles.select}
    }
    
    .form-button {
      ${formStyles.button}
    }
    
    .form-button:hover {
      ${formStyles.buttonHover}
    }
    
    .form-button:disabled {
      ${formStyles.buttonDisabled}
    }
    
    .form-input:focus,
    .form-textarea:focus,
    .form-select:focus {
      ${formStyles.focus}
    }
    
    .success-message {
      ${formStyles.successMessage}
    }
    
    .error-message {
      ${formStyles.errorMessage}
    }
  `;
};
