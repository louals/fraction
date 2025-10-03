import * as React from 'react';

export default function HelpCenterSettings(): React.ReactNode {
  return (
    <div>
      <h2 className='text-3xl text-[var(--color-fraction-violet-500)]'>
        Help Center
      </h2>
      <div className='mt-9'>
        <div className='flex flex-col gap-6'>
          <div>
            <h3 className='text-2xl text-[var(--color-fraction-violet-500)] font-semibold'>
              📌 Frequently Asked Questions (FAQ)
            </h3>
            <ul className='ml-6 mt-2 flex flex-col gap-1'>
              <li className='flex gap-2'>
                <span>🔹</span>
                <div>
                  <p className='font-semibold'>How do I change my password ?</p>
                  <p>
                    Go to Settings, Password & security and follow the
                    instructions to update your password.
                  </p>
                </div>
              </li>
              <li className='flex gap-2'>
                <span>🔹</span>
                <div>
                  <p className='font-semibold'>How do I delete my account ?</p>
                  <p>
                    If you wish to delete your account, go to Settings, Password
                    & security and follow the deletion process. Keep in mind
                    that this action is irreversible.
                  </p>
                </div>
              </li>
              <li className='flex gap-2'>
                <span>🔹</span>
                <div>
                  <p className='font-semibold'>
                    I'm having trouble logging in. What should I do ?
                  </p>
                  <p>
                    Try resetting your password via the "Forgot Password" option
                    on the login page. If the issue persists, contact support.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-2xl text-[var(--color-fraction-violet-500)] font-semibold'>
              📞 Contact & Support
            </h3>
            <ul className='ml-8 mt-2 flex flex-col gap-1'>
              <li>
                <p>Live Chat (Available from 9 AM to 6 PM, Monday to Friday)</p>
              </li>
              <li>
                <p>Email Support: support@yourwebsite.com</p>
              </li>
              <li>
                <p>
                  Support Form:{' '}
                  <a className='underline' href=''>
                    Submit a request
                  </a>
                </p>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-2xl text-[var(--color-fraction-violet-500)] font-semibold'>
              💡 Feedback & Suggestions
            </h3>
            <ul className='ml-8 mt-2 flex flex-col gap-1'>
              <li>
                <p>
                  Have ideas for improvements? Report an issue or suggest a
                  feature{' '}
                  <a className='underline' href=''>
                    here
                  </a>
                  .
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
