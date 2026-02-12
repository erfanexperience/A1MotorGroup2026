import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { INITIAL_FORM, STEPS } from './data'
import Stepper from './components/Stepper'
import VehicleStep from './components/steps/VehicleStep'
import ContactStep from './components/steps/ContactStep'
import IdentityStep from './components/steps/IdentityStep'
import AddressStep from './components/steps/AddressStep'
import EmploymentStep from './components/steps/EmploymentStep'
import ReviewStep from './components/steps/ReviewStep'
import styles from './ApplyForFinancing.module.css'

export default function ApplyForFinancing() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState(INITIAL_FORM)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const vehicleId = searchParams.get('vehicleId')
    if (vehicleId) {
      setForm((prev) => ({ ...prev, vehicleId }))
    }
  }, [searchParams])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const updateForm = useCallback((partial) => {
    setForm((prev) => {
      if (typeof partial === 'function') return partial(prev)
      const next = { ...prev }
      if (partial.vehicleId !== undefined) next.vehicleId = partial.vehicleId
      if (partial.personal) next.personal = { ...prev.personal, ...partial.personal }
      if (partial.identity) next.identity = { ...prev.identity, ...partial.identity }
      if (partial.residential) next.residential = { ...prev.residential, ...partial.residential }
      if (partial.employment) next.employment = { ...prev.employment, ...partial.employment }
      if (partial.consents) next.consents = { ...prev.consents, ...partial.consents }
      return next
    })
  }, [])

  const goNext = () => {
    setErrors({})
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const goBack = () => {
    setErrors({})
    setStep((s) => Math.max(s - 1, 0))
  }

  const handleSubmit = () => {
    const consent = form.consents.reviewAccepted
    if (!consent) {
      setErrors((e) => ({ ...e, consent: 'Please confirm to submit.' }))
      return
    }
    setSubmitting(true)
    console.log('Financing application payload:', form)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1200)
  }

  const currentStepId = STEPS[step]?.id
  const isReview = currentStepId === 'review'

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.successWrap}>
          <h2 className={styles.successTitle}>Application received</h2>
          <p className={styles.successText}>We’ll contact you shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageLayout}>
        <div className={styles.leftCol}>
          <header className={styles.header}>
            <h1 className={styles.title}>Apply for financing</h1>
            <p className={styles.subtitle}>
              Apply in minutes. No obligation. Your information stays secure.
            </p>
          </header>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.cardWrap}>
            <div className={styles.card}>
              <Stepper steps={STEPS} currentIndex={step} />
              <div className={styles.stepTitle}>{STEPS[step]?.title}</div>

              {currentStepId === 'vehicle' && (
            <VehicleStep form={form} updateForm={updateForm} />
          )}
          {currentStepId === 'contact' && (
            <ContactStep
              form={form}
              updateForm={updateForm}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {currentStepId === 'identity' && (
            <IdentityStep form={form} updateForm={updateForm} />
          )}
          {currentStepId === 'address' && (
            <AddressStep
              form={form}
              updateForm={updateForm}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {currentStepId === 'employment' && (
            <EmploymentStep form={form} updateForm={updateForm} />
          )}
          {currentStepId === 'review' && (
            <>
              <ReviewStep form={form} />
              <div className={styles.checkboxWrap}>
                <input
                  id="consent"
                  type="checkbox"
                  checked={form.consents.reviewAccepted}
                  onChange={(e) =>
                    updateForm({ consents: { ...form.consents, reviewAccepted: e.target.checked } })
                  }
                  className={styles.checkbox}
                  aria-invalid={!!errors.consent}
                />
                <label htmlFor="consent" className={styles.checkboxLabel}>
                  I confirm the information above is accurate and I agree to the credit application
                  process.
                </label>
              </div>
              {errors.consent && (
                <p className={styles.consentError} role="alert">
                  {errors.consent}
                </p>
              )}
            </>
          )}

              <div className={styles.navFooter}>
                {step > 0 ? (
                  <button type="button" onClick={goBack} className={styles.btnSecondary}>
                    Back
                  </button>
                ) : (
                  <span />
                )}
                <div className={styles.navRight}>
                  {!isReview ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className={styles.btnPrimary}
                      disabled={currentStepId === 'vehicle' && !form.vehicleId}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className={styles.btnPrimary}
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting…' : 'Submit application'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
