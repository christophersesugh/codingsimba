import { motion } from "framer-motion";
import { DataAndSecurity } from "./data-and-security";
import { ChangePassword } from "./change-password";
import { AccountInformation } from "./account-information";

export function Account() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AccountInformation />
      <ChangePassword />
      <DataAndSecurity />
    </motion.div>
  );
}
