export const successfulAggregationScan = ({ member }, curr) => {
  if (
    (member.connection_status !== 6 || member.is_being_aggregated === true) &&
    curr.connection_status === 6 &&
    curr.is_being_aggregated === false
  ) {
    return {
      isAggregationSuccessfull: true,
      member: curr,
    }
  }
  return {
    isAggregationSuccessfull: false,
    member: curr,
  }
}
