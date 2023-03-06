
const {connectService} = require('./connectApi')

module.exports = function(app){
  app.get(ApiEndpoints.APPDATA, async (req, res) => {
    res.context = req.body;
    res.context.job_type = res.context.job_type || 'agg';
    if (res.context.connection_id) {
      const conn = await connectService.loadMemberByGuid(res.context.connection_id);
      if (conn) {
        res.context.institution_id = conn.institution_code;
      }
    }
    res.send(req.body);
  })
  //async loadMaster()

  app.post(ApiEndpoints.MEMBERS, async (req, res) => {
    let ret = await connectService.addMember(req.body)
    res.send(ret)
  })
  // addMember(memberData: MemberData, connectConfig: any, appConfig : any, isHuman : boolean): Promise<{member: Member}>
  // return axiosInstance
  //     .post(
  //       ApiEndpoints.MEMBERS,
  //       {
  //         ...memberData,
  //         background_aggregation_is_disabled,
  //         client_redirect_url: connectConfig.client_redirect_url ?? null,
  //         include_transactions: connectConfig.include_transactions ?? null,
  //         referral_source: referralSource,
  //         skip_aggregation: true,
  //         ui_message_webview_url_scheme: appConfig.ui_message_webview_url_scheme ?? 'mx',
  //       },
  //       {
  //         headers: {
  //           'x-inter-hu': FireflyAPI.getHumanInteractionGuid(isHuman),
  //         },
  //       },
  //     )
  //     .then(response => response.data)
  app.put(`${ApiEndpoints.MEMBERS}/:member_guid`, async (req, res) => {
    let ret = await connectService.updateMember(req.body)
    res.send(ret)
  })
  // updateMember(member: Member, connectConfig: any, isHuman: boolean): Promise<Member>
  // return axiosInstance
  // .put(
  //   `${ApiEndpoints.MEMBERS}/${member.guid}`,
  //   {
  //     ...member,
  //     include_transactions: includeTransactions,
  //     skip_aggregation: true,
  //   },
  //   { headers },
  // )
  // .then(response => response.data.member)
  app.get(ApiEndpoints.MEMBERS, async (req, res) => {
    let ret = await connectService.loadMembers()
    res.send(ret)
  })
  // loadMembers(): Promise<Member[]>
  // return axiosInstance.get(ApiEndpoints.MEMBERS).then(response => response.data.members)

  app.get(`${ApiEndpoints.MEMBERS}/:member_guid`, async (req, res) => {
    let ret = await connectService.loadMemberByGuid(req.params.member_guid)
    res.send(ret)
  })
  // loadMemberByGuid(memberGuid: string): Promise<Member>
  // return axiosInstance.get(`${ApiEndpoints.MEMBERS}/${memberGuid}`).then(resp => {
  //   return resp.data.member
  // })

  app.delete(`${ApiEndpoints.MEMBERS}/:member_guid`, async (req, res) => {
    let ret = await connectService.deleteMember(req.params.member_guid)
    res.send(ret)
  })
  // deleteMember(member: Member): Promise<void>
  // return axiosInstance
  //     .delete(`${ApiEndpoints.MEMBERS}/${member.guid}`)
  //     .then(response => response.data)

  app.get(`${ApiEndpoints.INSTITUTIONS}/:institution_guid/credentials`, async (req, res) => {
    let ret = await connectService.getInstitutionCredentials(req.params.institution_guid)
    res.send(ret)
  })
  // getInstitutionCredentials(institutionGuid: string): Promise<Credential[]>
  // return axiosInstance
  //     .get(`${ApiEndpoints.INSTITUTIONS}/${institutionGuid}/credentials`)
  //     .then(response => response.data.credentials)

  app.get(`${ApiEndpoints.MEMBERS}/:member_guid/credentials`, async (req, res) => {
    let ret = await connectService.getMemberCredentials(req.params.member_guid)
    res.send(ret)
  })
  // getMemberCredentials(memberGuid: string): Promise<Credential[]>
  // return axiosInstance
  // .get(`${ApiEndpoints.MEMBERS}/${memberGuid}/credentials`)
  // .then(response => response.data.credentials)
  // // submitConnectFeedBack(feedBack)
  // // createSupportTicket(ticket)

  app.get(ApiEndpoints.INSTITUTIONS, async (req, res) => {
    let ret = await connectService.loadInstitutions(req.query.query)
    res.send(ret)
  })
  // loadInstitutions(query: string): Promise<Institution[]>
  // const url =
  //     typeof query === 'undefined'
  //       ? `${ApiEndpoints.INSTITUTIONS}`
  //       : `${ApiEndpoints.INSTITUTIONS}${FireflyAPI.buildQueryString(query)}`

  //   return axiosInstance.get(url).then(response => response.data)
  app.get(`${ApiEndpoints.INSTITUTIONS}/:institution_guid`, async (req, res) => {
    let ret = await connectService.loadInstitutionByGuid(req.params.institution_guid)
    //let ret = await connectService.loadInstitutionByCode(req.params.institution_guid)
    res.send(ret)
  })
  // loadInstitutionByGuid(guid: string): Promise<Institution>
  // return axiosInstance.get(ApiEndpoints.INSTITUTIONS + '/' + guid).then(response => ({
  //   ...response.data.institution,
  //   // Remove extra level of nesting
  //   credentials: response.data.institution.credentials.map(credential => credential.credential),
  // }))

  // loadInstitutionByCode(code: string): Promise<Institution>
  // const headers = {
  //   Accept: 'application/vnd.moneydesktop.v2+json',
  //   'Content-Type': 'application/json',
  //   'MD-Session-Token': window.app.options.session_token,
  // }
  // return axiosInstance
  //   .get(ApiEndpoints.INSTITUTIONS + '/' + code, { headers })
  //   .then(response => ({
  //     ...response.data.institution,
  //     // Remove extra level of nesting
  //     credentials: response.data.institution.credentials.map(credential => credential.credential),
  //   }))
  app.get(`${ApiEndpoints.INSTITUTIONS}/favorite`, async (req, res) => {
    let ret = await connectService.loadPopularInstitutions()
    res.send(ret)
  })
  // loadPopularInstitutions(query: string): Promise<Institution[]>
  // const url =
  //     typeof query === 'undefined'
  //       ? `${ApiEndpoints.INSTITUTIONS}/favorite`
  //       : `${ApiEndpoints.INSTITUTIONS}/favorite${FireflyAPI.buildQueryString(query)}`

  //   return axiosInstance.get(url).then(response => {
  //     return response.data
  //   })

  app.get(`${ApiEndpoints.INSTITUTIONS}/discovered`, async (req, res) => {
    let ret = await connectService.loadDiscoveredInstitutions()
    res.send(ret)
  })
  // loadDiscoveredInstitutions(): Promise<Institution[]>
  // const url = `${ApiEndpoints.INSTITUTIONS}/discovered`
  //   return axiosInstance.get(url).then(response => response.data)
}