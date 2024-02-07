import { CredentialTypes } from '../../../../connect/const/Credential'
import { EventActions } from '../../../../connect/const/Analytics'
import { getMFAFieldType, getMFAAnalyticAction } from '../../../../connect/views/mfa/utils'

describe('mfa utils tests', () => {
  it('getMFAFieldType can determine the credential.field_type', () => {
    expect(getMFAFieldType([{ field_type: 0, type: 1 }])).toBe(0)
  })

  it('getMFAFieldType can fallback to the credential.type', () => {
    expect(getMFAFieldType([{ type: 1 }])).toBe(1)
  })

  it('getMFAFieldType returns null when array is empty', () => {
    expect(getMFAFieldType([])).toBeNull()
  })

  it("getMFAFieldType returns null when arg isn't an Array", () => {
    expect(getMFAFieldType({ arg: 'is an object' })).toBeNull()
  })

  it('getMFAFieldType returns null when the credential is missing field_type and the type field', () => {
    expect(getMFAFieldType([{ param: 1 }])).toBeNull()
  })

  // Begin getMFAAnalyticAction
  it('getMFAAnalyticAction can determine OPTIONS', () => {
    // When an OPTIONS credentialType is used we specifically give the user an options MFA form
    const credentials = [{ field_type: CredentialTypes.OPTIONS }]
    const credentialType = getMFAFieldType(credentials)

    expect(getMFAAnalyticAction(credentialType, credentials)).toBe(EventActions.OPTIONS)
  })

  it('getMFAAnalyticAction can determine IMAGES', () => {
    // When an IMAGE_OPTIONS credentialType is used we specifically give the user an MFA form that lets the user select from images
    const credentials = [{ field_type: CredentialTypes.IMAGE_OPTIONS }]
    const credentialType = getMFAFieldType(credentials)

    expect(getMFAAnalyticAction(credentialType, credentials)).toBe(EventActions.IMAGES)
  })

  it('getMFAAnalyticAction can determine CHALLENGES', () => {
    // If there are multiple credentials provided (and the first one is not OPTIONS or IMAGE_OPTIONS)
    // We will present an MFA form to the user with multiple challenges
    const credentials = [{ field_type: CredentialTypes.TEXT }, { field_type: CredentialTypes.TEXT }]
    const credentialType = getMFAFieldType(credentials)

    expect(getMFAAnalyticAction(credentialType, credentials)).toBe(EventActions.CHALLENGES)
  })

  it('getMFAAnalyticAction can determine IMAGE', () => {
    // If there is a single credential provided with image_data, we present an Image challenge
    const credentials = [{ field_type: CredentialTypes.TEXT, image_data: 'someImageData' }]
    const credentialType = getMFAFieldType(credentials)

    expect(getMFAAnalyticAction(credentialType, credentials)).toBe(EventActions.IMAGE)
  })

  it('getMFAAnalyticAction can determine CHALLENGE', () => {
    // This is used as a catch if none of the other challenge types are used, but we were given a non-null credential type
    const credentials = [{ field_type: CredentialTypes.TEXT }]
    const credentialType = getMFAFieldType(credentials)

    expect(getMFAAnalyticAction(credentialType, credentials)).toBe(EventActions.CHALLENGE)
  })

  // Behavior if a null type is provided
  it('returns null if credential type of null is provided', () => {
    // This is used as a catch if none of the other challenge types are used, but we were given a non-null credential type
    const credentials = [{ no_type: CredentialTypes.TEXT }]
    const credentialType = getMFAFieldType(credentials)

    expect(getMFAAnalyticAction(credentialType, credentials)).toBe(null)
  })
})
