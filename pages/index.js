import React from 'react'
import Head from 'next/head'
import Time from '../helpers/time'
import Widget from '../component/widget'
import Footer from '../component/footer'
import Timezone from '../component/timezone'
import Router from 'next/router'

class Page extends React.Component {
  constructor(props) {
    super(props)

    let timezoneError = false

    if (!Time.zoneExists(this.props.timezone)) {
      timezoneError = true
    }
    this.state = {
      timezone: timezoneError ? 'UTC' : this.props.timezone,
      now: new Time(timezoneError ? 'UTC' : this.props.timezone)
    }
  }

  static async getInitialProps(request) {
    let timezone = request.query.tz || 'UTC'

    return {
      timezone: timezone
    }
  }

  changeTimeZone = (timezone) => {
    if (!Time.zoneExists(this.props.timezone)) {
      return
    }
    let newUrl = new URL(location)
    newUrl.searchParams.set('tz', timezone)

    Router.push(newUrl.pathname + newUrl.search)
    this.setState({
      timezone: timezone,
      now: new Time(timezone)
    })
  }

  render() {
    return (
      <>
        <Head>
          <link
            rel="icon"
            type="image/png"
            href={
              this.state.now.isFriday()
                ? 'https://shouldideploy.today/dots-red.png'
                : 'https://shouldideploy.today/dots.png'
            }
            sizes="32x32"
          />
          <meta
            property="og:image"
            content={
              this.state.now.isFriday()
                ? 'https://shouldideploy.today/no.png'
                : 'https://shouldideploy.today/yes.png'
            }
          />
          <title>Should I Deploy Today?</title>
        </Head>
        <div className={`wrapper ${this.state.now.isFriday() && 'its-friday'}`}>
          <div className="aligner">
            <Widget now={this.state.now} />
            <div className="meta">
              <Footer timezone={this.state.timezone} />
              <ul className="footer-list">
                <li>
                  Timezone:{' '}
                  <Timezone
                    onChange={this.changeTimeZone}
                    timezone={this.state.timezone}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Page
