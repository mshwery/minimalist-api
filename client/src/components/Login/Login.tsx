import React, { Component } from 'react'

export interface LoginArgs {
  email: string
  password: string
}

interface LoginProps {
  hasError: boolean
  isLoggingIn: boolean
  onLogin: (args: LoginArgs) => Promise<void>
  wrongEmail: boolean
  wrongPassword: boolean
}

interface LoginState {
  email: string
  password: string
}

class Login extends Component<LoginProps, LoginState> {
  state = {
    email: '',
    password: ''
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { email, password } = this.state

    if (!email || !password) {
      return
    }

    this.props.onLogin({ email, password })
  }

  handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value })
  }

  handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value })
  }

  renderErrorState() {
    let message = 'Hm, something went wrong'
    let actions

    if (this.props.wrongEmail) {
      message = 'This email does not seem to exist.'
      // TODO: actions = // link to sign up
    } else if (this.props.wrongPassword) {
      message = 'That\'s not the right password.'
      // TODO: actions = // link to reset password
    }

    return (
      <div>
        {message} {actions}
      </div>
    )
  }

  render() {
    const { email, password } = this.state
    const isDisabled = !email || !password

    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Login</h1>
        {this.props.hasError && this.renderErrorState()}
        <div>
          <label>
            Email:
            <input type='email' name='email' value={email} onChange={this.handleEmailChange} />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input type='password' name='password' value={password} onChange={this.handlePasswordChange} />
          </label>
        </div>
        <button type='submit' disabled={isDisabled}>Log In</button>
      </form>
    )
  }
}

export default Login
