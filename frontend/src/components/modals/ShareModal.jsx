import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

const ShareModal = ({
  isOpen,
  onClose,
  selectedPdf,
  shareSuccess,
  shareLink,
  copySuccess,
  setCopySuccess,
  emailList,
  emailInput,
  emailError,
  isSharing,
  handleShare,
  setEmailInput,
  setEmailError,
  handleEmailInputKeyDown,
  handleEmailInputBlur,
  removeEmail,
  setEmailList,
  setIsShareModalOpen,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/10" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left shadow-xl transition-all">
                {shareSuccess ? (
                  <div className="relative">
                    <button
                      onClick={onClose}
                      className="absolute right-0 top-0 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none cursor-pointer"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <div className="flex flex-col items-center justify-center space-y-6 py-8">
                      <div className="rounded-full bg-green-50 p-3">
                        <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-900">PDF Shared Successfully</h3>
                        <p className="mt-2 text-sm text-gray-500">The PDF has been shared with the specified recipients</p>
                      </div>
                      <div className="w-full max-w-md">
                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            value={shareLink}
                            className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-4 pr-12 text-sm text-gray-600 shadow-sm transition-all focus:border-blue-100 focus:bg-white focus:ring-1 focus:ring-blue-100"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(shareLink);
                              setCopySuccess(true);
                              setTimeout(() => setCopySuccess(false), 2000);
                            }}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 transition-all duration-200 cursor-pointer ${
                              copySuccess 
                                ? 'text-green-500 hover:text-green-600' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                            title={copySuccess ? 'Copied!' : 'Copy to clipboard'}
                          >
                            {copySuccess ? (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : selectedPdf && !shareSuccess ? (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <Dialog.Title
                          as="h3"
                          className="text-2xl font-medium text-gray-900"
                        >
                          Share PDF
                        </Dialog.Title>
                        <div className="mt-1">
                          <p className="text-sm text-gray-500">
                            Share "{selectedPdf?.fileName}" with others
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none cursor-pointer"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <form onSubmit={handleShare} className="mt-8">
                      <div className="space-y-6">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <label
                              htmlFor="emails"
                              className="block text-sm font-medium text-gray-900"
                            >
                              Recipients
                            </label>
                            <span className="text-xs font-medium text-gray-600 bg-gray-100 rounded-md px-2 py-1">
                              Press Enter or Space to add
                            </span>
                          </div>
                          <div className="relative mt-1">
                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                              <span className="text-gray-400">@</span>
                            </div>
                            <div className={`min-h-[100px] w-full rounded-lg border p-2 pl-8 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${
                              emailError ? 'border-red-300' : 'border-gray-200'
                            }`}>
                              <div className="flex flex-wrap items-start gap-2">
                                {emailList.map((email, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-sm text-gray-600"
                                  >
                                    {email}
                                    <button
                                      type="button"
                                      onClick={() => removeEmail(index)}
                                      className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                                <input
                                  type="text"
                                  id="emails"
                                  value={emailInput}
                                  onChange={(e) => {
                                    setEmailInput(e.target.value);
                                    setEmailError("");
                                  }}
                                  onKeyDown={handleEmailInputKeyDown}
                                  className="flex-1 border-none bg-transparent py-1 text-sm focus:outline-none"
                                  placeholder={emailList.length === 0 ? "Add email addresses" : ""}
                                />
                              </div>
                            </div>
                            {emailError && (
                              <div className="mt-2 text-sm text-red-600">
                                {emailError}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 text-sm text-gray-500">
                          Recipients will receive a secure link via email
                        </div>

                      </div>

                      <div className="mt-8 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none disabled:opacity-50 cursor-pointer"
                          onClick={() => {
                            setIsShareModalOpen(false);
                            setEmailList([]);
                            setEmailInput("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSharing || emailList.length === 0}
                          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSharing ? (
                            <>
                              <svg
                                className="mr-2 h-4 w-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Sharing...
                            </>
                          ) : (
                            <>
                              <svg
                                className="mr-2 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                              </svg>
                              Share PDF
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                ) : null}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ShareModal; 