import { useState } from 'react'
import Stepper from '../ApplyForFinancing/components/Stepper'
import styles from './SellYourCarPage.module.css'

const STEPS = [
  { id: 'personal', title: 'Personal information' },
  { id: 'vehicle', title: 'Vehicle information' },
  { id: 'comments', title: 'Additional comments' },
]

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  make: '',
  model: '',
  year: '',
  vin: '',
  mileage: '',
  additionalComments: '',
}

export default function SellYourCarPage() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const goBack = () => setStep((s) => Math.max(s - 1, 0))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    console.log('Sell your car submission:', form)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1200)
  }

  const currentStepId = STEPS[step]?.id
  const isLastStep = step === STEPS.length - 1

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.successWrap}>
          <h2 className={styles.successTitle}>Thank you</h2>
          <p className={styles.successText}>
            We’ve received your information and will contact you shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageLayout}>
        <div className={styles.leftCol}>
          <header className={styles.header}>
            <h1 className={styles.title}>Trade in your car</h1>
            <p className={styles.subtitle}>
              Get the best value for your vehicle. Share a few details and we’ll get back to you.
            </p>
          </header>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.cardWrap}>
            <div className={styles.card}>
              <Stepper steps={STEPS} currentIndex={step} />
              <div className={styles.stepTitle}>{STEPS[step]?.title}</div>

              <form onSubmit={handleSubmit} className={styles.form}>
                {currentStepId === 'personal' && (
                  <div className={styles.step}>
                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label htmlFor="first-name" className={styles.label}>
                          First name
                        </label>
                        <input
                          id="first-name"
                          type="text"
                          value={form.firstName}
                          onChange={(e) => update('firstName', e.target.value)}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="last-name" className={styles.label}>
                          Last name
                        </label>
                        <input
                          id="last-name"
                          type="text"
                          value={form.lastName}
                          onChange={(e) => update('lastName', e.target.value)}
                          className={styles.input}
                        />
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="email" className={styles.label}>
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="phone" className={styles.label}>
                        Phone number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className={styles.input}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                )}

                {currentStepId === 'vehicle' && (
                  <div className={styles.step}>
                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label htmlFor="make" className={styles.label}>
                          Vehicle make
                        </label>
                        <input
                          id="make"
                          type="text"
                          value={form.make}
                          onChange={(e) => update('make', e.target.value)}
                          className={styles.input}
                          placeholder="e.g. Toyota"
                        />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="model" className={styles.label}>
                          Model
                        </label>
                        <input
                          id="model"
                          type="text"
                          value={form.model}
                          onChange={(e) => update('model', e.target.value)}
                          className={styles.input}
                          placeholder="e.g. Camry"
                        />
                      </div>
                    </div>
                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label htmlFor="year" className={styles.label}>
                          Year
                        </label>
                        <input
                          id="year"
                          type="text"
                          inputMode="numeric"
                          value={form.year}
                          onChange={(e) => update('year', e.target.value)}
                          className={styles.input}
                          placeholder="e.g. 2020"
                        />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="vin" className={styles.label}>
                          VIN number
                        </label>
                        <input
                          id="vin"
                          type="text"
                          value={form.vin}
                          onChange={(e) => update('vin', e.target.value)}
                          className={styles.input}
                          placeholder="17-character VIN"
                        />
                      </div>
                      <div className={styles.field}>
                        <label htmlFor="mileage" className={styles.label}>
                          Mileage
                        </label>
                        <input
                          id="mileage"
                          type="text"
                          inputMode="numeric"
                          value={form.mileage}
                          onChange={(e) => update('mileage', e.target.value)}
                          className={styles.input}
                          placeholder="e.g. 45000"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStepId === 'comments' && (
                  <div className={styles.step}>
                    <div className={styles.field}>
                      <label htmlFor="comments" className={styles.label}>
                        Anything else we should know?
                      </label>
                      <textarea
                        id="comments"
                        value={form.additionalComments}
                        onChange={(e) => update('additionalComments', e.target.value)}
                        className={styles.textarea}
                        rows={4}
                        placeholder="Condition, modifications, reason for selling, etc."
                      />
                    </div>
                  </div>
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
                    {!isLastStep ? (
                      <button type="button" onClick={goNext} className={styles.btnPrimary}>
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className={styles.btnPrimary}
                        disabled={submitting}
                      >
                        {submitting ? 'Submitting…' : 'Submit'}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
