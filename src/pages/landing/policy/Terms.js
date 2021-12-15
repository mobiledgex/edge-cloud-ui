import React from "react";
import clsx from 'clsx';
import { Typography, Divider, makeStyles } from "@material-ui/core/";
import './style.css'
import Para from "./Para";
import Section from "./Section";

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
    }
});

export default function Terms() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Typography variant="h5" className={clsx(classes.textColor)}><b>Terms of Use</b></Typography>
            <Divider className={classes.divider} />
            <Typography variant="body1" className={clsx(classes.textColor)}><b>Effective date:</b> December 1, 2021</Typography>
            <div className={classes.content}>
                <Para>
                    Welcome! By accessing and using MobiledgeX Edge-Cloud Service and
                    related APIs accessed through the MobiledgeX console (“Edge
                    Services”), you agree to the terms and conditions provided in this
                    Terms of Service including all applicable Addendums for specific
                    service offerings (“TOS”) and the policies and guidelines provided
                    herein. This TOS constitutes an agreement between MobiledgeX, Inc.
                    (“MobiledgeX”, “we”, “us”, or “our”) and you, as an individual, or
                    the entity you represent as part of your administrative account
                    (“You”). You represent that you are legally able to enter into
                    agreements, that you are of legal age to do so, and if you are
                    accepting this TOS on behalf of an entity, such as your company, you
                    have all rights and authority to legally bind such entity. You
                    further represent that you are not a person barred from receiving
                    the Edge Services under the laws of the United States (including
                    export controls) or other applicable jurisdiction (including the
                    country in which you are resident or from which you use the Edge
                    Services) and your use of the Edge Services will comply with the
                    “Export Compliance and Excluded Data” section as provided below. You
                    further affirm that you are over the age of 13, as the Edge Services
                    are not intended for children under the age of 13. MobiledgeX
                    reserves the right to modify the TOS from time to time without prior
                    notice.
                </Para>
                <Section>1. Edge Services</Section>
                <Para>
                    Edge Services means the MobiledgeX services and products provided by
                    MobiledgeX to you under this TOS. Edge Services do not include Third
                    Party Software and Services, which is defined below.
                </Para>
                <Section>2. You must maintain the confidentiality of your MobiledgeX account information</Section>
                <Para>
                    You are responsible for maintaining the confidentiality of your
                    account username and password, and you acknowledge and agree that
                    you, and not MobiledgeX, are responsible for all activities that
                    occur under your account. You agree to immediately notify MobiledgeX
                    of any unauthorized use of your MobiledgeX account, username or
                    password.
                </Para>
                <Section>3. You are responsible for your use of the Edge Services</Section>
                <Para>
                    <ul>
                        <li>
                            <b>A. General.</b> You, and not MobiledgeX, are responsible for: (a)
                            your application including all information, data, text, software,
                            music, sound, photographs, graphics, video, messages, files,
                            attachments, or other materials, including images of your customer’s
                            application (“Customer Data”) that is created, transmitted, stored,
                            or displayed by, from, or within organizations associated with your
                            account including content of your end user;(b) the technical operation of the Customer Data including
                            maintaining compatibility with MobiledgeX’s APIs for the Edge
                            Service; (c) the conduct of all users of your account and for any
                            consequences of such conduct; (d) the monitoring of any Customer
                            Data you provide to MobiledgeX in connection with your use of the
                            Edge Services; (e) the procurement of, and compliance with, any
                            third party software licenses for software that you run within the
                            Edge Service. While MobiledgeX reserves the right to monitor your
                            Customer Data, we are under no obligation to do so.
                        </li>
                        <li>
                            <b>B. DMCA.</b> You are responsible for properly handling and processing notices
                            sent to you (or any of your affiliates) by any person claiming that
                            Customer Data violates such person’s rights, including notices
                            pursuant to the Digital Millennium Copyright Act.
                        </li>
                        <li>
                            <b>C. Security.</b> You are responsible for using reasonable security precautions to
                            maintain appropriate security and protection of all of your Customer
                            Data. To prevent unauthorized access, you should, for example,
                            consider encryption technology.
                        </li>
                        <li>
                            <b>D. Customer Data Preservation.</b> You are responsible for the preservation of all of your Customer
                            Data. You, and not MobiledgeX, are responsible for backing-up
                            Customer Data and any other content that you use with the Edge
                            Services. Best practices include routine archiving of Customer Data.
                            MobiledgeX is not obligated to retain any Customer Data after the
                            termination of your access to the Edge Services for any reason.
                            MobiledgeX may transfer Customer Data within a major geographic
                            region (for example, within the United States or within Europe) for
                            data redundancy or other purposes. As You control the placement of
                            Your workloads, MobiledgeX will not transfer your Customer Data
                            outside the major geographic region you specify (for example, from
                            the United States to Asia or from Europe to the United States).
                        </li>
                        <li>
                            <b>E. Your End User’s Use. </b>
                            You are responsible for your end user customers’ use of the Edge
                            Services and ensuring that such use is in compliance with the terms
                            and conditions of the TOS and with applicable law. If you discover
                            that an end user is in violation of this TOS or any applicable law,
                            you will terminate such end user’s access to the Edge Services
                            immediately. If you process the personal data of End Users or other
                            identifiable individuals in your use of a Service, you are
                            responsible for providing legally adequate privacy notices and
                            obtaining necessary consents for the processing of such data. You
                            represent to us that you have provided all necessary privacy notices
                            and obtained all necessary consents. You are responsible for
                            processing such data in accordance with applicable law.
                        </li>
                        <li>
                            <b>F. API requests. </b>
                            There is no default API rate limit imposed upon you in using the
                            service, however the system reserves the right to throttle requests
                            if necessary to protect the service.
                            <br />
                            There are three classes of API requests. Class I only has the HTTP
                            DELETE method. Class II is the GET, HEAD, OPTION methods. Class III
                            is the PUT, PUSH and LIST methods and Class IV Streaming API over
                            GRPC. MobiledgeX reserves the right to differentially charge for
                            these classes and to reclassify HTTP methods.
                        </li>
                        <li>
                            <b>G. Location of Data. </b>
                            You are solely responsible to designate, control and protect where
                            you choose to locate your MobiledgeX Edge-Cloud cloudlet, the
                            resulting application and end-user data. Your account and
                            administrative information relating to accessing the cloudlets
                            world-wide are stored by MobiledgeX in the United States and by
                            using the Edge Services, you agree to having any personal
                            information relating to the account be stored in the United States.
                        </li>
                    </ul>
                </Para>
                <Section>4. Your use of the Edge Services must be lawful and is subject to certain restrictions</Section>
                <Para>
                    You shall use the Edge Services only for purposes that are legal,
                    proper and in accordance with the TOS and the Acceptable Use Policy
                    (“AUP”). Furthermore, you agree that you will not engage in any
                    activity that interferes with or disrupts the Edge Services, servers
                    or networks connected to the Edge Services.
                </Para>
                <Para>
                    You shall not: (i) access and/or use the Edge Services if you are a
                    direct competitor of MobiledgeX, for purposes of monitoring
                    availability, performance or functionality, or for any other
                    benchmarking or competitive purposes; (ii) sell, resell, rent,
                    lease, offer any time sharing arrangement, service bureau or any
                    service based upon the Edge Services on a stand-alone basis (for the
                    avoidance of doubt, this subsection shall not be deemed to preclude
                    you from offering services that use and rely upon the Edge Services
                    where your other products or services add substantial value as
                    compared to the Edge Services alone); (iii) interfere with or
                    disrupt the integrity or performance of the Edge Services; (iv)
                    attempt to gain unauthorized access to the Edge Services or any
                    associated systems or networks; or (v) modify or make derivative
                    works based upon the Edge Services or any part thereof, or directly
                    or indirectly disassemble, decompile, or otherwise reverse engineer
                    the Edge Services or any portion thereof.
                </Para>
                <Section>5. Third Party Software and Services</Section>
                <Para>
                    In connection with your use of the Edge Services, solely as a
                    convenience for you and solely at your election, MobiledgeX may make
                    available to you the use of certain third party software and/or
                    services (“Third Party Software and Services”). MobiledgeX is not
                    liable or responsible for claims, damages, losses or any other
                    complaints arising out of or related to your use of such Third Party
                    Software and Services. Your use of any Third Party Software and
                    Services are subject to the terms and conditions directly between
                    you and the applicable third party vendor and at your own risk. You
                    hereby acknowledge that no purchase or license of any Third Party
                    Software and Services is required to use the Edge Services.
                </Para>
                <Section>6. If you use the Edge Services improperly, MobiledgeX may suspend or terminate your access to the Edge Services</Section>
                <Para>
                    We reserve the right to suspend or terminate your access to the Edge
                    Services if we determine (in our sole discretion) that you are in
                    violation of the TOS, the AUP, or any applicable laws.
                </Para>
                <Para>
                    For example, we may suspend or terminate your access to the Edge
                    Services if your use of the Edge Services: (i) poses a security risk
                    to the Edge Services or any third party, (ii) may be damaging to, or
                    degrading of, MobiledgeX’s network integrity, (iii) may subject us,
                    our affiliates, or any third party to legal liability, or (iv) may
                    be fraudulent.
                </Para>
                <Section>7. Fees, Billing and Free Trialses</Section>
                <Para>
                    <ul>
                        <li>
                            For the use of the Edge Services, you shall pay us the applicable
                            fees and charges in for the MobiledgeX Edge-Cloud subscription U.S.
                            Dollars by payment methods that we authorize.
                        </li>
                        <li>
                            If you elect to purchase MobiledgeX Support Services, Support
                            Services fees will be charged yearly in advance for the complete
                            month, regardless of the date of order (e.g. if you order Support
                            Services on the 15th of the month the effective date will be the
                            first of that same month.)
                        </li>
                        <li>
                            All payments must be made without setoffs, counterclaims, deductions
                            or withholdings. MobiledgeX shall not be responsible for any
                            additional bank fees, interest charges, finance charges, over draft
                            charges, or other fees resulting from charges billed by MobiledgeX.
                            Late payments hereunder will be subject to a monthly charge of one
                            and one-half percent (1.5%) per month, or the highest rate allowed
                            by applicable law, whichever is lower.
                        </li>
                        <li>
                            IF YOU BELIEVE THAT YOUR CHARGES ARE INCORRECT, YOU MUST CONTACT
                            MOBILEDGEX IN WRITING WITHIN 30 DAYS FROM THE DATE OF THE APPLICABLE
                            INVOICE (“DISPUTE PERIOD”) TO CONTEST SUCH CHARGES TO BE ELIGIBLE TO
                            RECEIVE AN ADJUSTMENT OR CREDIT. TO THE FULLEST EXTENT PERMITTED BY
                            LAW, YOU HEREBY WAIVE ALL CLAIMS RELATING TO ANY AND ALL CHARGES NOT
                            DISPUTED BY YOU DURING THE DISPUTE PERIOD (THIS DOES NOT AFFECT YOUR
                            CREDIT CARD ISSUER RIGHTS).
                        </li>
                        <li>
                            MobiledgeX may assess taxes on the amounts payable by you to
                            MobiledgeX, including, without limitation, any tax, levy, or similar
                            governmental charge assessed by any jurisdiction, whether based on
                            gross revenue, the provision of services, the performance of these
                            TOS, the delivery, possession or use of the Edge Services or any
                            other products or services offered by MobiledgeX pursuant to these
                            TOS, or otherwise, including without limitation all sales, use,
                            excise, import or export, value added, governmental permit fees,
                            license fees, and customs (collectively, “Taxes”). For the avoidance
                            of doubt, you shall have no liability for any taxes assessed on
                            MobiledgeX’s income by the United States or any state thereof.
                            Notwithstanding the foregoing, If MobiledgeX does not assess Taxes
                            on amounts payable by you to MobiledgeX under these TOS and Taxes
                            are assessed by any jurisdiction, Customer shall pay all such Taxes.
                        </li>
                        <li>
                            MobiledgeX reserves the right to change its fees and charges for the
                            Edge Services at any time. Any such changes will be effective when
                            such changes are posted on the MobiledgeX website, unless we
                            indicate otherwise. Similarly, we may introduce pricing and charges
                            for new products, features or services at any time by posting on the
                            MobiledgeX website.
                        </li>
                        <li>
                            For Free Trials, each Customer is eligible to participate in one
                            free trial. If we discover that a Customer has multiple free trial
                            accounts, we reserve the right to terminate all but one free trial
                            account of our choice in our sole discretion.
                        </li>
                        <li>
                            <b>Benchmarking: </b>
                            You may perform benchmarks or comparative tests or evaluations
                            (each, a “Benchmark”) of the Services. If you perform or disclose,
                            or direct or permit any third party to perform or disclose, any
                            Benchmark of any of the Services, you (i) will include in any
                            disclosure, and will disclose to us, all information necessary to
                            replicate such Benchmark, and (ii) agree that we may perform and
                            disclose the results of Benchmarks of your products or services,
                            irrespective of any restrictions on Benchmarks in the terms
                            governing your products or services.
                        </li>
                        <li>
                            <b>Beta and Previews: </b>
                            We do occasionally make available features and functions that are
                            not yet generally released, we may occasionally make these new
                            features available to You on an as-is basis without warranty or
                            support.
                        </li>
                    </ul>
                </Para>
                <Section>
                    <b>8. NO REFUNDS</b>
                </Section>
                <Para>
                    All charges are non-refundable unless expressly stated otherwise, or
                    otherwise provided by applicable law.
                </Para>
                <Section>
                    <b>
                        9. If you are delinquent on your payment, MobiledgeX may suspend
                        or terminate your access to the Edge Services
                    </b>
                </Section>
                <Para>
                    We reserve the right to suspend or terminate your access to and use
                    of the Edge Services if you are delinquent on your account.
                </Para>
                <Section>
                    <b> 10. Your cancellation of Edge Services</b>
                </Section>
                <Para>
                    You may terminate your use of the Edge Services at any time by
                    following the procedures below: As soon as you delete an instance or
                    service, you will lose all Customer Data on that instance or
                    service. As a reminder, you are responsible for backing up all
                    Customer Data you use with the Edge Services. Termination of the
                    Edge Services by you will not alter your obligations to pay all
                    charges due to MobiledgeX.
                </Para>
                <Section>
                    <b>11. Support Services</b>
                </Section>
                <Para>
                    <ul>
                        <li>
                            MobiledgeX Support Services offerings are described on MobiledgeX’s
                            website with additional information and detail available in
                            supporting documentation. Basic support is included with your Edge
                            Service, which provides for support assistance if you are
                            experiencing problems with your Edge Service (e.g. machine not
                            provisioning, not responding, etc.) Additional levels of Support
                            Service may be purchased from MobiledgeX.
                        </li>
                        <li>
                            If you purchase MobiledgeX Support Services you must do so for the
                            entire set of cloudlets under your account. Customers who have
                            multiple accounts can select the appropriate Support Service tier
                            for individual accounts, but cannot mix and match Support Service
                            tiers within an account.
                        </li>
                        <li>
                            Support Services are delivered under the terms and conditions of
                            this TOS and the MobiledgeX Support Services Policy.
                        </li>
                        <li>
                            From time to time, we apply upgrades, patches, bug fixes, or other
                            maintenance to the Edge Services. We agree to use reasonable efforts
                            to provide you with prior notice of any scheduled maintenance
                            (except for emergency maintenance), and you agree to use reasonable
                            efforts to comply with maintenance requirements that we may notify
                            you about.
                        </li>
                    </ul>
                </Para>
                <Section>
                    <b> 12. Service Level Agreement (“SLA”) </b>
                </Section>
                <Para>
                    Your use of the Cloud Services is subject to the terms and
                    conditions of our SLAs.
                </Para>
                <Section>
                    <b> 13. Modifications to and Discontinuation of Edge Services:</b>
                </Section>
                <Para>
                    <ul>
                        <li>
                            <b>A. Edge Services. </b>
                            We may modify or discontinue the Edge Services including adding,
                            removing or changing features or functionality of the Edge Services
                            from time to time. We will make information available regarding any
                            material change to or discontinuation of the Edge Services.
                        </li>
                        <li>
                            <b>B. New Applications. </b>
                            We may make new applications, tools, features or functionality
                            available from time to time through the Edge Services, the use of
                            which may be contingent upon your agreement to additional terms.
                        </li>
                        <li>
                            <b>C. APIs. </b>
                            We may modify or discontinue any APIs to the Edge Services from time
                            to time.
                        </li>
                        <li>
                            <b> D. TOS, SLA, AUP and Policies. </b>
                            We reserve the right to modify the terms and conditions of our TOS,
                            SLA and Policies (including, but not limited to, our Security and
                            Privacy Policy and Acceptable Use Policy) from time to time. We will
                            make information available regarding any material changes.
                        </li>
                    </ul>
                </Para>
                <Section>
                    <b>14. Intellectual Property Rights</b>
                </Section>
                <Para>
                    <ul>
                        <li>
                            The Edge Services, including all Intellectual Property Rights
                            therein and thereto, and any modification thereof, are and shall
                            remain the exclusive property of MobiledgeX and its licensors. You
                            shall not take any action that jeopardizes MobiledgeX’s or its
                            licensors’ proprietary rights or acquires any right in the Edge
                            Services or MobiledgeX’s Confidential Information, except the
                            limited rights expressly granted in this TOS. “Intellectual Property
                            Rights” means any and all (by whatever name or term known or
                            designated) tangible and intangible and now known or hereafter
                            existing (i) rights associated with works of authorship throughout
                            the universe, including, but not limited to, all exclusive
                            exploitation rights, copyrights, neighboring rights, moral rights
                            and mask-works, (ii) trademark, trade dress, and trade name rights
                            and similar rights, (iii) trade secret rights, (iv) patents,
                            designs, algorithms and other industrial property rights, (v) all
                            other intellectual and industrial property and proprietary rights
                            (of every kind and nature throughout the universe and however
                            designated), whether arising by operation of law, contract, license
                            or otherwise, and (vi) all registrations, applications, renewals,
                            extensions, continuations, divisions or reissues thereof now or
                            hereafter in force throughout the universe.
                        </li>
                        <li>
                            You hereby grant to MobiledgeX a royalty-free, worldwide,
                            transferable, sublicenseable, irrevocable, perpetual license to use
                            or incorporate into the Edge Services any suggestions, enhancement
                            requests, recommendations or other feedback related to the Edge
                            Service TOS provided by you to MobiledgeX.
                        </li>
                    </ul>
                </Para>
                <Section>
                    <b>15. Indemnification</b>
                </Section>
                <Para>
                    You agree to hold harmless and indemnify MobiledgeX, and its
                    subsidiaries, affiliates, officers, agents, and employees,
                    advertisers or partners, from and against any third party claim
                    arising from or in any way related to Customer Data, your use of the
                    Edge Services, or violation of these TOS, AUP or any other actions
                    connected with your use of the Edge Services, including any
                    liability or expense arising from all claims, losses, damages
                    (actual and consequential), suits, judgments, settlements,
                    litigation costs and reasonable attorneys’ fees, of every kind and
                    nature. In such a case, MobiledgeX will provide you with written
                    notice of such claim, suit or action and reasonable assistance at
                    your cost.
                </Para>
                <Section>
                    <b>16. DISCLAIMER OF WARRANTIES</b>
                </Section>
                <Para>
                    YOU EXPRESSLY UNDERSTAND AND AGREE THAT YOUR USE OF THE EDGE
                    SERVICES IS AT YOUR SOLE RISK. EDGE SERVICES ARE PROVIDED ON AN “AS
                    IS” AND “AS AVAILABLE” BASIS. ANY USE OF THE EDGE SERVICES IS DONE
                    AT YOUR OWN RISK AND YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE
                    TO YOUR COMPUTER SYSTEM OR OTHER DEVICE OR LOSS OF DATA THAT RESULTS
                    FROM USING THE EDGE SERVICES. MOBILEDGEX MAKES NO, AND HERERBY
                    EXPRESSLY DISCLAIMS (TO THE GREATEST EXTENT PERMISSIBLE UNDER
                    APPLICABLE LAW) ALL WARRANTIES, EXPRESS, IMPLIED OR OTHERWISE,
                    ARISING FROM COURSE OF DEALING OR USAGE OF TRADE, OR STATUTE, AS TO
                    THE EDGE SERVICES OR ANY MATTER WHATSOEVER. IN PARTICULAR, ANY AND
                    ALL WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
                    AND NON-INFRINGEMENT ARE EXPRESSLY EXCLUDED. MOBILEDGEX DOES NOT
                    WARRANT THAT THE OPERATION OF THE EDGE SERVICES WILL BE COMPLETELY
                    SECURE, ERROR FREE OR UNINTERRUPTED, OR THAT ALL ERRORS WILL BE
                    CORRECTED. YOU ASSUME ALL RISK OF DELAYS OR INTERRUPTIONS IN ACCESS
                    TO OR USE OF THE EDGE SERVICES RESULTING FROM USE OF THE INTERNET
                    AND/OR TELECOMMUNICATIONS TO ACCESS THE EDGE SERVICES, AND
                    MOBILEDGEX SHALL HAVE NO LIABILITY FOR ANY SUCH DELAYS OR
                    INTERRUPTION.
                </Para>
                <Section>
                    <b>17. LIMITATION OF LIABILITY</b>
                </Section>
                <Para>
                    UNDER NO CIRCUMSTANCES SHALL MOBILEDGEX OR ITS AFFILIATES BE LIABLE
                    FOR ANY SPECIAL, INDIRECT, INCIDENTAL, EXEMPLARY OR CONSEQUENTIAL
                    DAMAGES OF ANY KIND OR NATURE WHATSOEVER, OR FOR COST OF PROCUREMENT
                    OF SUBSTITUTE SERVICES, ARISING OUT OF OR IN ANY WAY RELATED TO THIS
                    TOS OR THE CLOUD SERVICES. SUCH LIMITATION ON DAMAGES INCLUDES, BUT
                    IS NOT LIMITED TO, LOST GOODWILL, LOST PROFITS, LOSS OF DATA OR
                    SOFTWARE OR WORK STOPPAGE, REGARDLESS OF THE LEGAL THEORY ON WHICH
                    THE CLAIM IS BROUGHT, EVEN IF MOBILEDGEX HAS BEEN ADVISED OF THE
                    POSSIBILITY OF SUCH DAMAGE OR IF SUCH DAMAGE COULD HAVE BEEN
                    REASONABLY FORESEEN, AND NOTWITHSTANDING ANY FAILURE OF ESSENTIAL
                    PURPOSE OF ANY EXCLUSIVE REMEDY PROVIDED IN THIS TOS. MOBILEDGEX’S
                    MAXIMUM LIABILITY FOR ANY DAMAGES ARISING OUT OF OR RELATED TO THIS
                    TOS OR THE EDGE SERVICES, WHETHER BASED ON CONTRACT, WARRANTY, TORT
                    (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE, SHALL BE
                    LIMITED TO THE AMOUNT YOU PAID TO MOBILEDGEX DIRECTLY ATTRIBUTABLE
                    TO THE MOBILEDGEX CLOUD SERVICE PROVIDED UNDER THIS TOS DURING THE
                    TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE FIRST EVENT GIVING RISE
                    TO LIABILITY UNDER THIS TOS. MOBILEDGEX SHALL HAVE NO LIABILITY OR
                    RESPONSIBILITY FOR ANY CUSTOMER DATA OR THIRD PARTY SOFTWARE. THE
                    FOREGOING LIMITATION OF LIABILITY IS INDEPENDENT OF, AND SHALL NOT
                    BE DEEMED TO MODIFY MOBILEDGEX’S OBLIGATION UNDER ANY EXCLUSIVE
                    REMEDIES FOR BREACH OF WARRANTY SET FORTH IN THIS TOS.
                </Para>
                <Section>
                    <b> 18. Export Compliance and Excluded Data</b>
                </Section>
                <Para>
                    <ul>
                        <li>
                            You acknowledge and agree that the Edge Services are subject to
                            applicable export control and trade sanctions laws, regulations,
                            legislative and regulatory requirements, rules and licenses
                            (collectively “export laws”), including without limit those of the
                            U.S. (e.g., the sanctions administered by the U.S. Department of
                            Treasury’s Office of Foreign Assets Control (31 CFR Part 500 et
                            seq.), the Export Administration Regulations (EAR, 15 CFR Part 730
                            et seq.) administered by the US Department of Commerce’s Bureau of
                            Industry and Security (BIS), laws and regulations targeting
                            proliferation activities, and the restricted persons lists
                            maintained by the US Government including but not limited to the
                            Denied Persons List, Unverified List, Entity List, Specially
                            Designated Nationals List, Debarred List and Non-proliferation
                            Sanctions). You agree to comply with these export laws and agree
                            that you alone are responsible for ensuring compliance with export
                            laws. In particular, but without limitation to the foregoing, you
                            will not, and will obtain assurances that none of your affiliates,
                            employees, contractors, agents or users will not, use, sell, resell,
                            export, re-export, import dispose of, disclose or otherwise deal
                            with the TOS, directly or indirectly, to any country, destination or
                            person without first obtaining any required export license or other
                            governmental, legislative or regulatory approval, and completing
                            such formalities as may be required by the export laws. You further
                            shall not do anything that would cause MobiledgeX to be in breach of
                            the export laws.
                        </li>
                        <li>
                            For clarity, you are solely responsible for compliance relating to
                            the manner in which you choose to use the Edge Services, including
                            your transfer, processing and provisioning of your Customer Data or
                            any other data, content or software to your end users and any
                            control laws of the country in which the Cloud Services are rendered
                            or received by you. Customer Data, software or any of your solution
                            that you provide in connection with the Cloud Services will not (i)
                            be classified or listed on the U.S. Munitions list; (ii) contain
                            defense articles or defense services; or (iii) contain ITAR-related
                            data (items (i) — (iii) collectively, the “Excluded Data”).
                        </li>
                    </ul>
                </Para>
                <Section>
                    <b>19. Notices</b>
                </Section>
                <Para>
                    <ul>
                        <li>
                            <b>19.1.Notices to You. </b>
                            Notices by MobiledgeX may be given to you under this TOS in any of
                            the following manners: a) by sending notices to your email address
                            registered with your MobiledgeX account; b) by overnight courier,
                            personal delivery, or registered or certified mail; or c) posting
                            such notices on the MobiledgeX website. Notices will be effective
                            upon posting or when sent, as applicable.
                        </li>
                        <li>
                            <b>19.2. Notices to Us. </b>
                            Notices by you to MobiledgeX must be given in either of the
                            following manners: a) by email to legal@mobiledgex.com; or b) by
                            overnight courier, personal delivery, or registered or certified
                            mail to: MobiledgeX, Inc., Attn: Legal 333 WSan Carlos Street, STE
                            600, San Jose, CA 95110. Notices are effective 3 business days after
                            being sent.
                        </li>
                    </ul>
                </Para>
                <Section>
                    <b>20. Entire Agreement</b>
                </Section>
                <Para>
                    This TOS, AUP, SLA and including any policies or amendments that may
                    be presented to you from time to time constitute the entire
                    agreement between you and MobiledgeX and shall govern your use of
                    the Edge Services, including any prior (written or verbal) offers
                    and statements.
                </Para>
                <Section>
                    <b> 21. Governing Law</b>
                </Section>
                <Para>
                    The Terms of Service and the relationship between you and
                    MobiledgeX, solely relating to the delivery and use of the Edge
                    Services, shall be governed by the laws of the State of California
                    without regard to its conflict of law provisions. You and MobiledgeX
                    agree to submit to the personal and exclusive jurisdiction of the
                    courts located within the County of Santa Clara, California.
                </Para>
                <Section>
                    <b>22. Nature of Relationship</b>
                </Section>
                <Para>
                    The Terms of Service do not create or imply any partnership, agency
                    or joint venture between you and MobiledgeX.
                </Para>
                <Section>
                    <b> 23. Feedback, Comments and Questions</b>
                </Section>
                <Para>
                    We are always looking for ways to improve our services. If you have
                    feedback, comments and/or questions regarding the Edge Services,
                    please feel free to contact us at:
                </Para>
                <Para>
                    MobiledgeX, Inc.
                    <br />
                    333 W San Carlos St., STE 600
                    <br />
                    San Jose, CA 95110
                    <br />
                </Para>
            </div>
        </React.Fragment>
    );
}
