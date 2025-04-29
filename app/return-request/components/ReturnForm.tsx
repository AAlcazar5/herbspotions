"use client";

import React, { FC, ReactNode, ComponentType } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Button } from '@/shared/components/Button';

interface TextErrorProps {
  children?: ReactNode;
}
const TextError: ComponentType<TextErrorProps> = ({ children = null }) => {
  return <div className="text-destructive-500 dark:text-destructive-500 text-xs mt-1">{children}</div>;
};

interface ReturnFormValues {
  orderNumber: string;
  reason: string;
  comments?: string;
}
  
interface ReturnFormProps {
  onSubmit: (values: ReturnFormValues) => void;
  onCancel?: () => void;  
}

const ReturnForm: FC<ReturnFormProps> = ({ onSubmit, onCancel }) => {
  const validationSchema = yup.object({
    orderNumber: yup.string().required('Please enter your order number.'),
    reason: yup.string().required('Please select a reason for the return.'),
    comments: yup.string().optional(),
  });

  const inputBaseClasses = "block w-full rounded-md shadow-sm border px-3 py-2 leading-tight transition-colors duration-150 ease-in-out";
  const inputThemeClasses = "bg-input dark:bg-input border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground";
  const inputFocusClasses = "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background";
  const inputCombinedClasses = `${inputBaseClasses} ${inputThemeClasses} ${inputFocusClasses}`;
  const selectClasses = `${inputCombinedClasses} appearance-auto`;
  const textareaClasses = `${inputCombinedClasses}`;

  return (
    <div className="max-w-md mx-auto p-6 bg-card dark:bg-card rounded-md shadow-md dark:shadow-lg border border-border dark:border-border">
      <h2 className="text-xl font-semibold mb-6 text-foreground dark:text-foreground">Initiate a Return</h2>
      <Formik
        initialValues={{ orderNumber: '', reason: '', comments: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="block text-foreground dark:text-foreground text-sm font-bold mb-2">
                Order Number:
              </label>
              <Field
                type="text"
                id="orderNumber"
                name="orderNumber"
                className={inputCombinedClasses}
              />
              <ErrorMessage name="orderNumber" component={TextError} />
            </div>

            <div>
              <label htmlFor="reason" className="block text-foreground dark:text-foreground text-sm font-bold mb-2">
                Reason for Return:
              </label>
              <Field
                as="select"
                id="reason"
                name="reason"
                className={selectClasses}
              >
                <option value="">Select a reason</option>
                <option value="damaged">Damaged Item</option>
                <option value="wrongItem">Received Wrong Item</option>
                <option value="notSatisfied">Not Satisfied</option>
                <option value="other">Other</option>
              </Field>
              <ErrorMessage name="reason" component={TextError} />
            </div>

            <div>
              <label htmlFor="comments" className="block text-foreground dark:text-foreground text-sm font-bold mb-2">
                Comments (Optional):
              </label>
              <Field
                as="textarea"
                id="comments"
                name="comments"
                rows="3"
                className={textareaClasses}
              />
              <ErrorMessage name="comments" component={TextError} />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="py-2 px-4"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="py-2 px-4"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReturnForm;