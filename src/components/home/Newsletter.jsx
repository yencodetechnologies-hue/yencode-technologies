import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    const subject = encodeURIComponent('Newsletter Subscription')
    const body = encodeURIComponent(`Please subscribe this email to the newsletter:\n\n${email}`)
    window.location.href = `mailto:info@yencodetechnologies.com?subject=${subject}&body=${body}`
  }

}
