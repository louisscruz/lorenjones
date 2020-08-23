import React, { useCallback, useMemo, useState } from "react"
import { XXL } from "@zendeskgarden/react-typography"
import { Button } from "@zendeskgarden/react-buttons"
import { Alert, Close, Title } from "@zendeskgarden/react-notifications"
import {
  Field,
  Input,
  Label,
  Message,
  Textarea,
} from "@zendeskgarden/react-forms"
import { Dots } from "@zendeskgarden/react-loaders"

import ContentContainer from "../components/ContentContainer"

const defaultErrors = []

const getNameErrors = value => {
  const errors = []

  if (!value) {
    errors.push("Name is required")
  } else if (value.length > 200) {
    errors.push("Name must be less than 200 characters")
  }

  return errors
}

const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

const getEmailErrors = value => {
  const errors = []

  if (!value) {
    errors.push("Email is required")
  } else if (!EMAIL_REGEX.test(value)) {
    errors.push("Email must be valid")
  }

  return errors
}
const getMessageErrors = value => {
  const errors = []

  if (!value) {
    errors.push("Message is required")
  }

  if (value.length > 20000) {
    errors.push("Message must be less than 20,000 characters")
  }

  return errors
}

const generateDefaultFieldState = validator => ({
  errors: validator(""),
  hasBeenBlurred: false,
  value: "",
})

const formDataToJson = formData => {
  const subject = `New message from ${formData.name} (${formData.email})`

  const dataObjectToUse = { ...formData }

  // eslint-disable-next-line no-underscore-dangle
  dataObjectToUse._subject = subject
  // eslint-disable-next-line no-underscore-dangle
  dataObjectToUse._replyTo = formData.email

  return JSON.stringify(dataObjectToUse)
}

const sendContactForm = formData => {
  if (!formData.name || !formData.email || !formData.message) {
    return Promise.reject(
      new Error(
        "Expected form to have a name, email, and message, but it did not."
      )
    )
  }

  return fetch(process.env.GATSBY_CONTACT_FORM_POST_URL, {
    body: formDataToJson(formData),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  }).then(response => {
    if (!response.ok) {
      throw new Error(
        `There was an error reaching the email submission service provider. Received status code: ${response.status}`
      )
    }

    return response.json()
  })
}

let alertId = 0

const generateAlertId = () => {
  alertId++
  return alertId
}

const Contact = React.memo(() => {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(generateDefaultFieldState(getNameErrors))
  const [email, setEmail] = useState(generateDefaultFieldState(getEmailErrors))
  const [message, setMessage] = useState(
    generateDefaultFieldState(getMessageErrors)
  )
  const [alerts, setAlerts] = useState([])
  const addAlert = useCallback(({ content, title, type }) => {
    const alert = {
      content,
      id: generateAlertId(),
      title,
      type,
    }

    setAlerts(previousAlerts => [...previousAlerts, alert])
  }, [])

  const isValidForm = useMemo(
    () => !name.errors.length && !email.errors.length && !message.errors.length,
    [email.errors.length, message.errors.length, name.errors.length]
  )

  const handleSubmission = useCallback(
    event => {
      event.preventDefault()

      if (isLoading) {
        return
      }

      if (!isValidForm) {
        setEmail(previousState => ({ ...previousState, hasBeenBlurred: true }))
        setName(previousState => ({ ...previousState, hasBeenBlurred: true }))
        setMessage(previousState => ({
          ...previousState,
          hasBeenBlurred: true,
        }))
        return
      }

      setIsLoading(true)

      sendContactForm({
        email: email.value,
        message: message.value,
        name: name.value,
      })
        .then(() => {
          setName(generateDefaultFieldState(getNameErrors))
          setEmail(generateDefaultFieldState(getEmailErrors))
          setMessage(generateDefaultFieldState(getMessageErrors))
          addAlert({
            content:
              "Your message has been sent! Loren will get back to you as soon as possible.",
            title: "Message Sent!",
            type: "success",
          })
        })
        .catch(error => {
          console.error(error)
          addAlert({
            content: `There was a problem sending your message. If this problem persists, send Loren an email at ${process.env.GATSBY_LORENS_EMAIL_ADDRESS}.`,
            title: "Uh Oh!",
            type: "error",
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [
      addAlert,
      email.value,
      isLoading,
      isValidForm,
      message.value,
      name.value,
      setEmail,
      setIsLoading,
      setName,
      setMessage,
    ]
  )

  const handleNameChange = useCallback(({ target: { value } }) => {
    setName(previousState => ({
      ...previousState,
      errors: getNameErrors(value),
      value,
    }))
  }, [])
  const handleEmailChange = useCallback(({ target: { value } }) => {
    setEmail(previousState => ({
      ...previousState,
      errors: getEmailErrors(value),
      value,
    }))
  }, [])
  const handleMessageChange = useCallback(({ target: { value } }) => {
    setMessage(previousState => ({
      ...previousState,
      errors: getMessageErrors(value),
      value,
    }))
  }, [])
  const handleNameBlur = useCallback(() => {
    setName(previousState => ({ ...previousState, hasBeenBlurred: true }))
  }, [])
  const handleEmailBlur = useCallback(() => {
    setEmail(previousState => ({ ...previousState, hasBeenBlurred: true }))
  }, [])
  const handleMessageBlur = useCallback(() => {
    setMessage(previousState => ({ ...previousState, hasBeenBlurred: true }))
  }, [])

  const nameErrors = useMemo(
    () =>
      name.hasBeenBlurred && name.errors.length ? name.errors : defaultErrors,
    [name.hasBeenBlurred, name.errors]
  )
  const emailErrors = useMemo(
    () =>
      email.hasBeenBlurred && email.errors.length
        ? email.errors
        : defaultErrors,
    [email.hasBeenBlurred, email.errors]
  )
  const messageErrors = useMemo(
    () =>
      message.hasBeenBlurred && message.errors.length
        ? message.errors
        : defaultErrors,
    [message.hasBeenBlurred, message.errors]
  )

  return (
    <ContentContainer>
      {alerts.map(({ content, id, title, type }) => (
        <Alert key={id} type={type}>
          <Title>{title}</Title>
          {content}
          <Close aria-label="Close Alert" />
        </Alert>
      ))}
      <XXL>Contact</XXL>
      <form
        action={process.env.GATSBY_CONTACT_FORM_POST_URL}
        method="POST"
        onSubmit={handleSubmission}
      >
        <Field>
          <Label>Name</Label>
          <Input
            name="_name"
            onBlur={handleNameBlur}
            onChange={handleNameChange}
            validation={nameErrors.length ? "error" : undefined}
            value={name.value}
          />
        </Field>
        {nameErrors.map(error => (
          <Message key={error} validation="error">
            {error}
          </Message>
        ))}
        <Field>
          <Label>Email</Label>
          <Input
            name="email"
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            validation={emailErrors.length ? "error" : undefined}
            value={email.value}
          />
        </Field>
        {emailErrors.map(error => (
          <Message key={error} validation="error">
            {error}
          </Message>
        ))}
        <Field>
          <Label>Message</Label>
          <Textarea
            isResizable
            onBlur={handleMessageBlur}
            onChange={handleMessageChange}
            validation={messageErrors.length ? "error" : undefined}
            value={message.value}
          />
        </Field>
        {messageErrors.map(error => (
          <Message key={error} validation="error">
            {error}
          </Message>
        ))}
        <Button isPrimary isStretched type="submit">
          Submit
          {isLoading && <Dots />}
        </Button>
      </form>
    </ContentContainer>
  )
})

export default Contact
