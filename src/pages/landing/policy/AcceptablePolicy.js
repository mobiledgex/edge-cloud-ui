/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import { Typography, Divider, makeStyles } from "@material-ui/core/";
import clsx from "clsx";
import Section from "./Section";
import Para from "./Para";
const useStyles = makeStyles({
    textColor: {
        color: '#273c43'
    },
    divider: {
        backgroundColor: '#AEAEAE',
        marginTop: 5,
        marginBottom: 5
    },
    content: {
        marginTop: 15,
        textAlign: 'justify',
        padding: 10
    },
    section:{

    }
});

export default function AcceptablePolicy() {
    const classes = useStyles();
    const introduction = [
        "This document sets forth the principles, guidelines and requirements of the Acceptable Use Policy of MobiledgeX, Inc. (“Company”) governing the use by you, as an individual, or the entity you represent as part of your administrative account  (“You”) for MobiledgeX Edge-Cloud services and products (“Services and Products”). The Purpose of the MobiledgeX’s Acceptable Use Policy, hereinafter referred to as the AUP, is to comply with all federal, state, and local laws coupled with protecting the network security, network availability, physical security, Your privacy, and other factors affecting the services provided by MobiledgeX. MobiledgeX reserves the right to impose reasonable rules and regulations regarding the use of its services provided to all of its customers and such rules and regulations are subject to change. Such rules and regulations are located on the Internet at http://www.MobiledgeX.com/aup. The AUP is not an all-inclusive or exhaustive list and MobiledgeX reserves the right to modify the AUPs at any time as needed, effective upon either the posting of the modified AUPs or notification to You via email. Any violation of the AUPs may result in the suspension or termination of your account or such other action as MobiledgeX deems appropriate. No credits will be issued for any interruption in service resulting from policy violations.",
        "VIOLATION OF ANY SECTION OF THE AUP IS STRICTLY PROHIBITED AND MAY RESULT IN THE IMMEDIATE TERMINATION OR SUSPENSION OF THE SERVICES YOU RECEIVE FROM MOBILEDGEX.",
        "Any questions or comments regarding the AUP should be directed to legal@MobiledgeX.com."
    ]

    const networkSecurityviolations = [
        "1. Introduction of malicious programs into the network or server (example: viruses, worms, Trojan Horses and other executables intended to inflict harm).",
        "2. Effecting security breaches or disruptions of Internet communication and/or connectivity. Security breaches include, but are not limited to, accessing data of which the you or your Customer is not an intended recipient or logging into a server or account that You or your Customer is not expressly authorized to access. For purposes of this section, “disruption” includes, but is not limited to port scans, flood pings, email-bombing, packet spoofing, IP spoofing and forged routing information.",
        "3. Executing any form of network activity that will intercept data not intended for the You or Your Customer’s server.",
        "4. Circumventing user authentication or security of any host, network or account.",
        "5. Interfering with or denying service to any user other than You or your Customer’s host (example: denial of service attack or distributed denial of service attack).",
        "6. Using any program script/command, or sending messages of any kind, designed to interfere with or to disable, a user’s terminal session, via any means, locally or via the Internet.",
        "7. Network interference by You or any of your Customers that may cause or is currently causing network interference with another Customer will be disconnected immediately. No service credits will be issued to You or Your Customers disconnected for network violations.",
        "8. Transmission, distribution or storage of any material in violation of any applicable law or regulation is prohibited. This includes, without limitation, material protected by copyright, trademark, trade secret or other intellectual property right used without proper authorization, and material that is obscene, defamatory, constitutes an illegal threat, or violates export control laws.",
        "9. Sending Unsolicited Bulk Email (“UBE”, “spam”). The sending of any form of Unsolicited Bulk Email through the MobiledgeX Edge-Cloud platform is prohibited. Likewise, the sending of UBE from another service provider advertising a web site, email address or utilizing any resource hosted on the MobiledgeX Edge-Cloud platform is prohibited. MobiledgeX, Inc. accounts or services may not be used to solicit customers from, or collect replies to, messages sent from another Internet Service Provider where those messages violate either this Policy or that of the other provider.",
        "10. Running Unconfirmed Mailing Lists. Subscribing email addresses to any mailing list without the express and verifiable permission of the email address owner is prohibited. All mailing lists run by MobiledgeX, Inc. customers must be Closed-loop (“Confirmed Opt-in”). The subscription confirmation message received from each address owner must be kept on file for the duration of the existence of the mailing list. Purchasing lists of email addresses from 3rd parties for mailing to from any MobiledgeX Edge-Cloud domain, or referencing any MobiledgeX Edge-Cloud platform account, is prohibited.",
        "11. Advertising, transmitting, or otherwise making available any software, program, product, or service that is designed to violate this AUP or the AUP of any other Internet Service Provider, which includes, but is not limited to, the facilitation of the means to send Unsolicited Bulk Email, initiation of pinging, flooding, mail-bombing, denial of service attacks.",
        "12. Operating an account on behalf of, or in connection with, or reselling any service to, persons or firms listed in the Spamhaus Register of Known Spam Operations (ROKSO) database at www.spamhaus.org.",
        "13. Unauthorized attempts by a user to gain access to any account or computer resource not belonging to that user (e.g., “cracking”).",
        "14. Obtaining or attempting to obtain service by any means or device with intent to avoid payment.",
        "15. Accessing or attempting to access your account or other MobiledgeX services after You (or Company) has cancelled Your or your Customer’s account.",
        "16. Unauthorized access, alteration, destruction, or any attempt thereof, of any information of any MobiledgeX, Inc. other customers or end-users by any means or device, including the use of ‘sudo’ or other privileged operating system commands.",
        "17. Knowingly engage in any activities designed to harass, or that will cause a denial-of-service (e.g., synchronized number sequence attacks) to any other user whether on the MobiledgeX Edge-cloud network or on another provider’s network.",
        "18. Using MobiledgeX, Inc.’s Services to interfere with the use of the MobiledgeX network by other customers or authorized users. Examples may include crypto mining, denial of service, or other activities that may impact the MobiledgeX network. These are prohibited and accounts may be terminated without warning."
    ]

    return (
        <React.Fragment>
            <Typography variant="h5" className={clsx(classes.textColor)}><b>ACCEPTABLE USE POLICY</b></Typography>
            <Divider className={classes.divider} />
            <Typography variant="body1" className={clsx(classes.textColor)}><b>Effective date:</b> December 1, 2021</Typography>

            <Section> Introduction</Section>
            <Para>
                <ul>
                    {introduction.map((intro, index) => <li key={index}>{intro}</li>)}
                </ul>
            </Para>
            <Section>Compliance with Law</Section>
            <Para>
                You, nor shall You permit your customers to post, transmit, re-transmit or store material on or through any of Company’s Services or Products which, in the sole judgment of the Company (i) is in violation of any local, state, federal or non-United States law or regulation, (ii) threatening, obscene, indecent, defamatory or that otherwise could adversely affect any individual, group or entity (collectively, “Persons”) or (iii) violates the rights of any person, including rights protected by copyright, trade secret, patent or other intellectual property or similar laws or regulations including, but not limited to, the installation or distribution of “pirated” or other software products that are not appropriately licensed for use by Customer. Customer shall be responsible for determining what laws or regulations are applicable to its use of the Services and Products.
            </Para>
            <Section>Your Security Obligation</Section>
            <Para>
                Each user of a console account must use reasonable care in keeping software they run on the MobiledgeX’s servers up-to-date and patched with the latest security updates. Failure to use reasonable care to protect your account may result in a security compromise by outside sources. A compromised server creating network interference will result in immediate notification from MobiledgeX and will be disconnected from the network immediately so as to not directly affect other accounts. No service credits will be issued for outages resulting from disconnection due to breached server security. You are solely responsible for any breaches of security under Your control affecting servers.. The labor used to resolve any damage is categorized as Emergency Security Breach Recovery and is currently charged at $400 USD per hour. System and Network Security Violations of system or network security are strictly prohibited, and may result in criminal and civil liability. MobiledgeX investigates all incidents involving such violations and will cooperate with law enforcement if criminal violation is suspected.
            </Para>
            <br/>
            <Para><b>Examples of system or network security violations include, without limitation, the following:</b></Para>
            <Para>
                <ul>
                    {networkSecurityviolations.map((point, index) =>
                        <li key={index}>{point}</li>
                    )}
                </ul>
            </Para>
        </React.Fragment>
    );
}