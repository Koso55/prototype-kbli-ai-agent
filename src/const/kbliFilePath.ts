import fs from "fs";
import path from "path";

export interface KBLIParentSourceFIle {
  kbliId: string;
  code: string;
  title: string;
  description: string;
}

export interface KBLIDerivativeSourceFile extends KBLIParentSourceFIle {
  directParentCode: string;
  directParentKbliId: string;
  topParentCode: string;
  topParentKbliId: string;
}

interface KBLIReqObgData {
  title: string;
  timeframe: string;
}

interface AuthorityParameter {
  parameter: string;
  authority: string;
}

interface Permit {
  type: string;
  title: string;
}

interface ScopeRegulation {
  id: string;
  title: string;
  description: string;
}

interface KBLISavedScopeGeneralInfo {
  scale: string;
  totalArea: string;
  riskLevel: string;
  permit: string;
  validityPeriod: string;
  timeframe: string;
}

interface KBLISavedScopeDetailsData {
  generalInfo: KBLISavedScopeGeneralInfo;
  requirements: KBLIReqObgData[];
  obligations: KBLIReqObgData[];
  authorityParams: AuthorityParameter[];
  permits: Permit[];
}

interface KBLISavedScopeDetails {
  title: string;
  scopes: KBLISavedScopeDetailsData[];
}

export interface KBLIDerivativeWithScopeDetailsSourceFile
  extends KBLIDerivativeSourceFile {
  specialRequirement: string[];
  scopes: KBLISavedScopeDetails[];
  regulations: ScopeRegulation[];
}

export const KBLIParentFilePath = path.resolve(
  __dirname,
  `../../assets/kbli/kbli_parent.json`
);

export const KBLIFirstDerivativeFilePath = path.resolve(
  __dirname,
  `../../assets/kbli/kbli_derivative_1.json`
);

export const KBLISecondDerivativeFilePath = path.resolve(
  __dirname,
  `../../assets/kbli/kbli_derivative_2.json`
);

export const KBLIThirdDerivativeFilePath = path.resolve(
  __dirname,
  `../../assets/kbli/kbli_derivative_3.json`
);

export const KBLIFourthDerivativeFilePath = path.resolve(
  __dirname,
  `../../assets/kbli/kbli_derivative_with_scope_4.json`
);

export const findKbliFileByFilePath = (
  filePath: string
): Promise<
  | KBLIParentSourceFIle[]
  | KBLIDerivativeSourceFile[]
  | KBLIDerivativeWithScopeDetailsSourceFile[]
> => {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};
