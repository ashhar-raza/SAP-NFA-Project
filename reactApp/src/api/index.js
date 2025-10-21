import { getEntityData } from "./sapApi";

// Example: Fetch all NfaDetails
const data = await getEntityData("NfaDetails");

// Example: Fetch NfaVendorData with filter
const filtered = await getEntityData("NfaVendorData", {
  $filter: "vendorId eq 'V001'"
});

console.log(data);
