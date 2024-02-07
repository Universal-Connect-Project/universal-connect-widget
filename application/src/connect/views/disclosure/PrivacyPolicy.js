import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { css } from '@mxenabled/cssinjs'
import parseISO from 'date-fns/parseISO'
import format from 'date-fns/format'

import { useTokens } from '@kyper/tokenprovider'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'

import { SlideDown } from '../../components/SlideDown'
import { GoBackButton } from '../../components/GoBackButton'
import { getDelay } from '../../utilities/getDelay'
import { LeavingNoticeFlat } from '../../components/LeavingNoticeFlat'

import useAnalyticsPath from '../../hooks/useAnalyticsPath'
import { PageviewInfo } from '../../const/Analytics'

import { __ } from '../../../utils/Intl'
import { goToUrlLink } from '../../utilities/global'
import { useSelector } from 'react-redux'

export const PrivacyPolicy = props => {
  const { handleGoBack } = props
  useAnalyticsPath(...PageviewInfo.CONNECT_DISCLOSURE_PRIVACY_POLICY)
  const [showLeavingNotice, setShowLeavingNotice] = useState(false)
  const showExternalLinkPopup = useSelector(state => state.clientProfile.show_external_link_popup)
  const [currentUrl, setCurrentUrl] = useState(null)

  const getNextDelay = getDelay()
  const tokens = useTokens()
  const styles = getStyles(tokens)

  // This function handles the click of the link in the privacy policy
  const handleLinkClick = (url, isExternalUrl = true) => {
    const newUrl = { url, isExternalUrl }

    if (showExternalLinkPopup) {
      setShowLeavingNotice(true)
      setCurrentUrl(newUrl)
    } else {
      goToUrlLink(url, isExternalUrl)
    }
  }

  return (
    <div>
      {showLeavingNotice ? (
        <SlideDown delay={getNextDelay()}>
          <LeavingNoticeFlat
            onCancel={() => {
              setShowLeavingNotice(false)
              setCurrentUrl(null)
            }}
            onContinue={() => {
              goToUrlLink(currentUrl.url, currentUrl.isExternalUrl)
              // reset current url back to null
              setCurrentUrl(null)
              setShowLeavingNotice(false)
            }}
          />
        </SlideDown>
      ) : (
        <React.Fragment>
          <SlideDown delay={getNextDelay()}>
            <GoBackButton handleGoBack={handleGoBack} />
            <div style={styles.header}>
              <Text tag="h2">{__('MX Privacy Policy')}</Text>
              <Text style={styles.lastUpdatedDate}>
                {/* --TR: Full string "Last updated: {date}" */
                __('Last updated: %1', format(parseISO('2022-04-06'), 'MMMM d, yyyy'))}
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Who we are')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'MX Technologies, Inc., (“MX”) is a software development company that develops and licenses personal finance software for financial institutions to offer to their customers for personal finance management. MX puts a user’s data on center stage, molding it into a cohesive, intelligible, and interactive visualization. As a result, users engage more often and more deeply with other digital banking products. MX software enables financial institutions to better utilize data and provide customers with a superior platform to manage their personal finances through data cleansing, categorization and classification. Data is sourced from the records of the financial institution with an optional software feature for users to add external accounts such as credit cards, loans, mortgages, and accounts from other financial institutions, for a user’s all-inclusive financial management view.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'MX is based in the United States and has an extensive history of providing exceptional service for key clients who are major players in their respective industries.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'MX respects your privacy and takes safeguarding personal data seriously. Please read this Privacy Policy to understand the privacy practices of MX. This Privacy Policy applies to the website or application from which you access MX services and/or any of its affiliated web or mobile applications (“Services”). Please be aware that your financial institution and/or its other service providers may have different privacy policies for data collected, stored or utilized outside of the Services.',
                )}
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Definitions')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  '“Personal Data” means any information relating to an identified or identifiable natural person; an identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that natural person. Personal Data does not include information that is anonymized. Personal Data also does not include corporate information that relates to an organization but not to an individual, such as a corporate name, corporate address or general corporate phone number. However, if it is combined with your Personal Data in a manner that reasonably allows it to be associated with your identity, or is otherwise considered Personal Data under applicable law, it will be treated as Personal Data under this Privacy Policy.',
                )}
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('EU-U.S. privacy shield framework')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'Based on subsequent court and regulator decisions, MX no longer relies on the EU-U.S. and Swiss-U.S. Privacy Shield Frameworks as a legal basis for transfers of personal data from the European Union and Switzerland, and instead relies on Standard Contractual Clauses (SCC). For more information on Standard Contractual Clauses, please visit ',
                )}
                <Button
                  onClick={() =>
                    handleLinkClick(
                      'https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en',
                    )
                  }
                  role="link"
                  style={styles.link}
                  variant="link"
                >
                  https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en.
                </Button>
                {__(
                  'However, because MX remains committed to the underlying privacy principles, MX continues to comply with the EU-U.S. Privacy Shield Framework and Swiss-U.S. Privacy Shield Framework as set forth by the U.S. Department of Commerce. MX has certified to the Department of Commerce that it adheres to the Privacy Shield Principles. If there is any conflict between the terms in this Privacy Policy and the Privacy Shield Principles, the Privacy Shield Principles shall govern. To learn more about the Privacy Shield program, and to view our certification, please visit ',
                )}
                <Button
                  onClick={() => handleLinkClick('https://www.privacyshield.gov/list')}
                  role="link"
                  style={styles.link}
                  variant="link"
                >
                  https://www.privacyshield.gov/list.
                </Button>
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Personal data we process')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'We process personal data on behalf of our clients to fulfill our contractual obligations as a third-party service provider. We also process personal data obtained from our third-party service providers to aggregate data when customers choose to use these features. We also process personal data that we collect directly such as when a user navigates to our website or when we generate potential sales leads. This data may be collected through information that you actively submit to us or through automated processes. We process the personal data of data subjects that include client representatives, representatives of potential clients, other business representatives, users, and client customers.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'We do not actively collect or otherwise process personal data from minors. The age of a minor varies by country. For the purposes of personal data collected from the European Union, the age of a minor is under age sixteen (16). We do not actively collect or otherwise process special categories of personal data as identified in the EU General Data Protection Regulation (“GDPR”) including data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade-union membership, or genetic data, biometric data for the purpose of uniquely identifying a natural person, data concerning health or data concerning a natural person’s sex life or sexual orientation. We do not actively collect or otherwise process personal data relating to criminal convictions and offences.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'The personal data we process in relation to our personal finance software is based upon our contractual requirements with the client and in turn their contractual requirements with their customers. We contractually require our clients to obtain the necessary consents from their customers before providing access to the personal finance software. The expected consequences of failing to consent to the processing of personal data in the use of the personal finance software is that access to the software will not be granted.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'The personal data we process in relation to our business-to-business activities and the provision of personal data is not a statutory requirement nor a contractual requirement on the part of the data subject, although we do provide services under our customer contracts. The possible consequences of failing to provide personal data is that we will be unable to respond to requests or inquiries or interact for business purposes.',
                )}
              </Text>
              <div style={styles.subSection}>
                <Text style={styles.subTitle} tag="h3">
                  {__('A.  Data processed as a third-party provider on behalf of our clients')}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'We process personal data of our client’s customers on behalf of our clients to perform our contractual obligations under our service agreements. Processing includes analyzing financial transactions and performing advanced data cleaning, classifying and categorizing for presentation and use of that data. The data analysis can be extended to financial transactions obtained from external accounts, which is those outside of the financial institution hosting the software, if the feature is activated by the clients’ customers. We also process personal data of clients’ customers in an aggregate form to assist our clients offer meaningful promotions such as personal loans, credit cards, and mortgages, based upon analyzed information.',
                  )}
                </Text>
              </div>
              <div style={styles.subSection}>
                <Text style={styles.subTitle} tag="h3">
                  {__('B.  Data processed from third-party service providers')}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'When the software feature to aggregate external accounts is activated, we share personal data with Data Aggregator Service Providers, who share with us the financial transactions of the external account. These processing activities are key to our business value. We source this information on behalf of our clients, as authorized by our clients’ customers, in order to perform our contractual obligations under our service agreements. This service is an integrated part of our overall advanced data analysis features available with our personal finance software and related services. Data sourced from third-party service providers is shared with our clients and also used by us on behalf of our clients in the aggregate to customize promotional offers for financial products. We do not separately sell personal data.',
                  )}
                </Text>
              </div>
              <div style={styles.subSection}>
                <Text style={styles.subTitle} tag="h3">
                  {__('C.  Data processed directly')}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'We process technical information and navigational information when you visit our website, which is found at ',
                  )}

                  <Button
                    onClick={() => handleLinkClick('https://www.mx.com/', false)}
                    role="link"
                    style={styles.link}
                    variant="link"
                  >
                    https://www.mx.com/.
                  </Button>
                  {__(
                    ' Technical information includes IP address, geographical location, device ID and related information and browser type. Navigational information includes pages viewed, selection made and length of visit. Our primary goal in processing this information from you is to provide you access to features on the site and help us improve our product and services and develop and market new products and services.',
                  )}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'We process contact information and information related to employment when you fill out web forms or downloaded content. This information includes your name, email address, company name, address, phone number and other information about yourself or your business or employment. We process personal data available through social media including Facebook, LinkedIn, Twitter and Google, as well as publicly available information that we acquire directly. We process this information to advance our business purposes such as offering our services to corporate representatives.',
                  )}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'We may also process payment information when you pay for certain MX services.',
                  )}
                </Text>
              </div>
              <div style={styles.subSection}>
                <Text style={styles.subTitle} tag="h3">
                  {__('D.  California Consumer Privacy Act')}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'Pursuant to the § 1798.110 of the California Consumer Privacy Act (“CCPA”) the categories of personal information we have collected about consumers in the preceding 12 months are:',
                  )}
                </Text>

                <ul style={styles.list}>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">
                      {__(
                        'Identifiers such as a real name, postal address, online identifier, Internet Protocol address, email address;',
                      )}
                    </Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">
                      {__(
                        'Personal information categories described in the California Customer Records Statute (Cal. Civ. Code §1798.80(e));',
                      )}
                    </Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">
                      {__(
                        'Characteristics of protected classifications under California or federal law;',
                      )}
                    </Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">{__('Commercial information;')}</Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">
                      {__('Internet or other electronic network activity information;')}
                    </Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">{__('Geolocation data;')}</Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">
                      {__('Professional or employment-related information;')}
                    </Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">
                      {__(
                        'Inferences drawn from any of the information identified in this subdivision to create a profile about a consumer reflecting the consumer’s preferences, characteristics, psychological trends, predispositions, behavior, attitudes, intelligence, abilities, and aptitudes.',
                      )}
                    </Text>
                  </li>
                </ul>
              </div>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Tracking technologies, cookies, and clear GIFs')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'We use tracking technologies, cookies and clear GIFs to collect information. Tracking technologies are used to collect information from your web browser through our servers or filtering systems when you visit any of our sites.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'Cookies store small text files onto a user’s computer hard drive with the user’s browser, containing the session ID and other data. Cookies enable a web site to track a user’s activities on the website for the following purposes: (1) enable essential features; (2) provide analytics to improve website performance and effectiveness; (3) store user preferences; and (4) facilitate relevant targeted advertising on advertising platforms or networks. Users are free to change their web browsers to prevent the acceptance of cookies. Cookies may also be set within emails in order to track how often our emails are opened.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'A clear GIF is a transparent graphic image placed on a website. The use of clear GIFs allows us to monitor your actions when you open a web page and makes it easier for us to follow and record the activities of recognized browsers. Clear GIFs are used in combination with cookies to obtain information on how visitors interact with our websites.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'Information collected may include but is not limited to your browser type, your operating system, your language preference, any referring web page you were visiting before you came to our site, the date and time of each visitor request, and information you search for on our sites. We can also track the path of page visits on a website and monitor aggregate usage and web traffic routing on our sites. We collect this information to better understand how you use and interact with our sites in order to improve your experience. We also collect this information to better understand what services and marketing promotions may be more relevant to you. We may also share this information with our employees, service providers and customer affiliates.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'You can change your web browser settings to stop accepting cookies or to prompt you before accepting a cookie from the sites you visit. If you do not accept cookies, however, you may not be able to use some sections or functions of our sites.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit ',
                )}
                <Button
                  onClick={() => handleLinkClick('http://www.allaboutcookies.org')}
                  role="link"
                  style={styles.link}
                  variant="link"
                >
                  http://www.allaboutcookies.org.
                </Button>
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__('To opt out of being tracked by Google Analytics across all websites visit ')}
                <Button
                  onClick={() => handleLinkClick('https://tools.google.com/dlpage/gaoptout')}
                  role="link"
                  style={styles.link}
                  variant="link"
                >
                  https://tools.google.com/dlpage/gaoptout.
                </Button>
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Purposes for processing personal data')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'We process personal data to fulfil our contractual obligations in our service contracts with clients and assist clients in optimizing advanced data analytics. We contractually require our clients to obtain the necessary consents in order to process personal data for the core components of processing such as data cleaning, classifying and categorizing, and for aggregation of external accounts.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'In addition, we process personal data in order to operate our business, including for sales leads, information services, web analysis, security monitoring, and recruitment and employment. Our purpose in processing this personal data is to develop new client relationships, increase our client service and for administrative and other business purposes.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'In this context, the legal basis for our processing of your personal data is either the necessity to perform contractual and other obligations or our legitimate business interests as a provider of personal finance software and related services. If personal data processing is related to cookies and other tracking technologies, we rely upon the consent given when we display our cookie banner and the user selects “Accept”. We do not process that category of personal data if the user selects “Decline”.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'We may use your data to comply with applicable laws, exercise legal rights, and meet tax and other regulatory requirements. We may also use your personal data for internal purposes, including auditing, data analysis, system troubleshooting, and research.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'In these cases, we base our processing on legitimate interests in performing the activities of the organization.',
                )}
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Sharing of personal data')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'We share your personal data with clients, third-party service providers, regulatory bodies, public authorities and law enforcement in the following circumstances:',
                )}
              </Text>
              <div style={styles.subSection}>
                <Text style={styles.subTitle} tag="h3">
                  {__('A.  Clients')}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'Personal data we obtain from our third-party service providers is shared with our clients where that personal data is obtained through use of our software that has been licensed to that client. For example, where a client’s customer accesses our software and provides personal data for the purpose of aggregating data from external accounts, that data is shared with and accessible to the client.',
                  )}
                </Text>
              </div>
              <div style={styles.subSection}>
                <Text style={styles.subTitle} tag="h3">
                  {__('B.  Third-party providers')}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'We share personal data with third-party providers for their processing in performing functions on our behalf. The categories of third-party providers with whom we share personal data are: Customer Relations Management Software Providers; Lead-generation Service Providers; Data Analytics Service Providers; Technology Software Providers; Data Aggregator Services Providers; Accessor Service Providers; Web Analytics Service Providers, and Security Monitoring Service Providers. In such instances, the providers will be contractually required to protect personal data from additional processing (including for marketing purposes) and transfer in accordance with this Privacy Policy and applicable laws.',
                  )}
                </Text>
              </div>
              <div style={styles.subSection}>
                <Text style={styles.subTitle} tag="h3">
                  {__('C.  Research bodies')}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'For a limited number of users, who provide their explicit consent, we share personal data with a third-party for the purposes of conducting research on financial behavior with an aim to assist the user to monitor and improve financial management.',
                  )}
                </Text>
              </div>
              <div style={styles.subSection}>
                <Text style={styles.subTitle} tag="h3">
                  {__('D.  Regulatory bodies, public authorities, and law enforcement')}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'We may access and disclose your personal data to regulatory bodies if we have a good-faith belief that doing so is required under regulation. This may include submitting personal data required by tax authorities. We may disclose your personal data in response to lawful requests by public authorities or law enforcement, including to meet national security or law enforcement requirements.',
                  )}
                </Text>
              </div>
              <div style={styles.subSection}>
                <Text style={styles.subTitle} tag="h3">
                  {__('E.  Other disclosures')}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'We may also disclose your personal data to exercise or defend legal rights; to take precautions against liability; to protect the rights, property, or safety of the resource, of any individual, or of the general public; to maintain and protect the security and integrity of our services or infrastructure; to protect ourselves and our services from fraudulent, abusive, or unlawful uses; or to investigate and defend ourselves against third-party claims or allegations. Disclosures may be made to courts of law, attorneys and law enforcement or other relevant third parties in order to meet these purposes.',
                  )}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'In cases of onward transfer of personal information to third parties of data of EU individuals received pursuant to the EU-U.S. Privacy Shield, MX remains liable.',
                  )}
                </Text>
              </div>
              <div style={styles.subSection}>
                <Text style={styles.subTitle} tag="h3">
                  {__('F.  California Consumer Privacy Act')}
                </Text>
                <Text style={styles.paragraph} tag="p">
                  {__(
                    'Pursuant to the § 1798.115 of the CCPA the categories of personal information we have',
                  )}
                  <Text as="Paragraph" bold={true}>
                    {' '}
                    {__('disclosed about consumers for a business purpose')}{' '}
                  </Text>
                  {__('in the preceding 12 months are:')}
                </Text>
                <ul style={styles.list}>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">
                      {__(
                        'Identifiers such as a real name, postal address, online identifier, Internet Protocol address, email address;',
                      )}
                    </Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">
                      {__(
                        'Personal information categories described in the California Customer Records Statute (Cal. Civ. Code §1798.80(e));',
                      )}
                    </Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">
                      {__(
                        'Characteristics of protected classifications under California or federal law;',
                      )}
                    </Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">{__('Commercial information;')}</Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">
                      {__('Internet or other electronic network activity information;')}
                    </Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">{__('Geolocation data;')}</Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">
                      {__('Professional or employment-related information;')}
                    </Text>
                  </li>
                  <li className={css(styles.listItem)}>
                    <Text as="Paragraph">
                      {__(
                        'Inferences drawn from any of the information identified in this subdivision to create a profile about a consumer reflecting the consumer’s preferences, characteristics, psychological trends, predispositions, behavior, attitudes, intelligence, abilities, and aptitudes.',
                      )}
                    </Text>
                  </li>
                </ul>
              </div>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Storage of your personal data')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'Personal data stored on behalf of our clients and for our own purposes is processed and stored at various locations including on servers located in the United States of America. In the event that personal data is transferred outside of the United States of America, we will ensure that adequate protections are implemented to comply with the GDPR, such as Standard Contractual Clauses. We endeavor to utilize third-party service providers from the United States that have certified with the EU-U.S. Privacy Shield Framework or alternatively provide adequate protections that are compliant with the GDPR such as implementing Standard Data Protection Clauses.',
                )}
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Data security')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'We use industry accepted standard, protocols and precautions to guide us in implementing technical and organizational measures to protect the personal data that we store, transmit, or otherwise process against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access. We regularly consider appropriate new security technology and methods as we maintain and develop our software and systems. The practical reality is, however, no data transmissions over the Internet can be guaranteed to be 100% secure. Therefore, we cannot ensure or warrant the security of any information you transmit to us and you understand that any information that you transfer to us is done at your own risk. If we learn of a data breach that is likely to affect the security of your personal data, we may attempt to notify you electronically via email so that you can take appropriate protective steps and/or by posting a notice on our website if a data breach occurs. Depending on where you live, you may have a legal right to receive notice of a security breach in writing.',
                )}
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Data retention')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'MX retains the personal data of its clients and clients’ customers for a period of time as instructed by the clients for whom MX processes data. Where MX collects personal data for its own purposes, it retains the data for a reasonable period of time to fulfill the processing purposes mentioned above. Personal data is then archived for time periods required or necessitated by law or legal considerations. When archival is no longer required, personal data is deleted from our records. If you wish to request a deletion of your data, please contact directly the client who provided the source of data. If you want more information about how to contact a client, make an inquiry to the address provided at the end of this notice.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'We retain personal data that we are required to retain in order to meet our regulatory obligations including tax records and transaction history. We regularly review our retention policy to ensure compliance with our obligations under data protection laws and other regulatory requirements. We regularly audit our databases and archived information to ensure that personal data is only stored and archived in alignment with our retention policy.',
                )}
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Personal data rights')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'Individuals have the right to access personal data about them and to correct, amend, restrict or delete that information where it is inaccurate, or has been processed in violation of the Principles, except where the burden or expense of providing access would be disproportionate to the risks to the individual’s privacy in the case in question, or where the rights of persons other than the individual would be violated.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'Where you are receiving communication from us of a marketing nature directly related to MX’s business marketing purposes, we provide the ability for you to unsubscribe at the end of the email. You may also contact us directly or through the MX representative with whom you have a relationship to exercise your right to object to marketing communication or to exercise other rights. In addition, where we act as a data controller in relation to your personal data for our general business operations and that personal data is not required for regulatory or legal purposes or the like, we offer you a choice to limit the use and disclosure of your personal data. You may make such request by contacting the MX representative with whom you have contact or by contacting us directly. Our contact details are provided at the end of this Privacy Policy.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'MX provides personal finance software and related services for its clients and as such processes personal data on their behalf. If you submit a request to us in relation to processing personal data that is performed on behalf of a client, we will inform that client of your request and act upon their instructions, unless there is a regulatory requirement to directly respond. At your request, we will provide you with the relevant contact information of the client.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'Personal data subject rights under the GDPR applies to individuals in the European Economic Area, granting certain rights which may be subject to limitations and/or restrictions. These rights include the right to: (i) request access to and rectification or erasure of their personal data; (ii) obtain restriction of processing or to object to processing of their personal data; and (iii) ask for a copy of their personal data to be provided to them, or a third party, in a digital format. If you wish to exercise one of the above-mentioned rights, please send us your request to the contact details set out below. Individuals also have the right to lodge a complaint about the processing of their personal data with their local data protection authority.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'Personal data subject rights under the CCPA may also apply to certain individuals and households. These rights include the right to: (i) know what personal information is being collected about them; (ii) know whether their personal data is sold or disclosed at to whom; (iii) say no to the personal sale of information; (iv) access their personal information; (v) equal service and price, even if they exercise their privacy rights; (vi) an accurate privacy notice at or before the time of the collection of personal information; (vii) request disclosure of the categories and specific pieces of personal information collected; and (viii) request deletion of personal information subject to certain exceptions.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'MX will not discriminate against you for exercising any of your rights under the CCPA.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'You may contact us with your personal data inquiries or for assistance in modifying or updating your personal data and to exercise additional statutory rights such as: access, rectification, data portability, objection, processing restriction, and erasure of your personal data. Upon receipt of a request to exercise your rights under the CCPA, MX may seek information from you in order to verify your identity as the consumer from whom we have collected or processed Personal Data and such other information as reasonably required to enable MX to validate your request. Our contact details are provided at the end of this Privacy Policy.',
                )}
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Dispute resolution')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'MX participates in the EU-U.S. Privacy Shield Framework and Swiss-U.S. Privacy Shield Framework (“Frameworks”), under MX Technologies, Inc. A list of participants can be viewed by accessing the link below:',
                )}
              </Text>
              <Button
                onClick={() => handleLinkClick('https://www.privacyshield.gov/list')}
                role="link"
                style={styles.link}
                variant="link"
              >
                https://www.privacyshield.gov/list.
              </Button>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'As part of its participation in the Frameworks, MX is subject to the investigatory and enforcement powers of the Federal Trade Commission.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'Organizations participating in the Frameworks must respond within 45 days of receiving a complaint. If you have not received a timely or satisfactory response to your question or complaint, please contact one of the independent recourse mechanisms listed below:',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__('JAMS Privacy Shield Program')}
              </Text>
              <Button
                onClick={() =>
                  handleLinkClick(
                    'http://ec.europa.eu/justice/article-29/structure/data-protection-authorities/index_en.html',
                  )
                }
                role="link"
                style={styles.link}
                variant="link"
              >
                http://ec.europa.eu/justice/article-29/structure/data-protection-authorities/index_en.html.
              </Button>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'Please note that these independent dispute resolution bodies are designated to address complaints and provide appropriate recourse free of charge to the individual.',
                )}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'If a Consumer’s complaint cannot be resolved through MX’s internal processes, MX will cooperate with JAMS pursuant to the JAMS International Mediation Rules, available on the JAMS website at www.jamsadr.com/international-mediation-rules. JAMS mediation may be commenced as provided for in the relevant JAMS rules. The mediator may propose any appropriate remedy, such as deletion of the relevant personal data, publicity for findings of noncompliance, payment of compensation for losses incurred as a result of noncompliance, or cessation of processing of the personal data of the Consumer who brought the complaint. The mediator or the Consumer also may refer the matter to the U.S. Federal Trade Commission, which has Privacy Shield investigatory and enforcement powers over MX. Under certain circumstances, Consumers also may be able to invoke binding arbitration to address complaints about MX’s compliance with the Privacy Shield Principles.',
                )}
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Effective date and amendments')}
              </Text>
              <Text style={styles.paragraph} tag="p">
                {__(
                  'This document is effective as of the date indicated at the top of this Privacy Policy under “Last updated”. This document may be amended from time to time.',
                )}
              </Text>
            </div>
          </SlideDown>
          <SlideDown delay={getNextDelay()}>
            <div style={styles.section}>
              <Text style={styles.title} tag="h3">
                {__('Contact us')}
              </Text>
              <Text as="Paragraph" style={styles.paragraph}>
                {__('Inquiries may be made to:')}
              </Text>
              <Text as="Paragraph" style={styles.paragraph}>
                {__('Organization: ')}
                {'MX Technologies, Inc.'}
              </Text>
              <Text as="Paragraph" style={styles.paragraph}>
                {__('Contact: Data Privacy Team')}
              </Text>
              <Text as="Paragraph" style={styles.paragraph}>
                {__('Address: ')}
                {'3401 North Thanksgiving Way Suite 500 Lehi, UT 84043'}
              </Text>
              <Text as="Paragraph" style={styles.paragraph}>
                {__('E-mail: ')}
                {'termsofuse@mx.com'}
              </Text>
              <Text as="Paragraph" style={styles.paragraph}>
                {__('Phone: ')}
                {'801-669-5500'}
              </Text>
            </div>
          </SlideDown>
        </React.Fragment>
      )}
    </div>
  )
}
const getStyles = tokens => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  lastUpdatedDate: {
    color: tokens.TextColor.Secondary,
    fontWeight: tokens.FontWeight.Normal,
    fontSize: tokens.FontSize.XSmall,
    lineHeight: tokens.LineHeight.Small,
    marginTop: tokens.Spacing.XSmall,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: tokens.Spacing.XLarge,
  },

  subSection: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: tokens.Spacing.Medium,
  },
  title: {
    marginBottom: tokens.Spacing.XSmall,
  },
  subTitle: {
    marginBottom: tokens.Spacing.XSmall,
    fontSize: tokens.FontSize.Body,
    lineHeight: tokens.LineHeight.Body,
  },
  paragraph: {
    marginBottom: tokens.Spacing.XSmall,
    fontSize: tokens.FontSize.ParagraphSmall,
    lineHeight: tokens.LineHeight.ParagraphSmall,
  },
  link: {
    display: 'inline',
    whiteSpace: 'normal',
    height: 'auto',
    fontSize: tokens.FontSize.Small,
    textAlign: 'left',
  },
  list: {
    listStylePosition: 'outside',
    marginTop: tokens.Spacing.Small,
  },
  listItem: {
    color: tokens.TextColor.Default,
    marginLeft: tokens.Spacing.XLarge,
    marginBottom: tokens.Spacing.XSmall,
    '& span': {
      fontSize: tokens.FontSize.ParagraphSmall,
      lineHeight: tokens.LineHeight.ParagraphSmall,
    },
  },
})

PrivacyPolicy.propTypes = {
  handleGoBack: PropTypes.func.isRequired,
}
