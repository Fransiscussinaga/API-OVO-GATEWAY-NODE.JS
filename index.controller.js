const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs")

function randomString(length, chars) {
    var result = "";
    for (var i = length; i > 0; --i)
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

const ovoPayment = async (req, res) => {
    let tXid;
    //User Data Registration
    const iMid = "OVOTEST001";
    const referenceNo = `VID-${moment().format("YYYYMMDD")}-${randomString(
        6,
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    )}`;
    const amt = 19000;
    const timestamp = moment().format("YYYYMMDDHHMMSS");

    const merchantKey =
        "33F49GnCMS1mFYlGXisbUDzVf2ATWCl9k3R++d5hDd3Frmuos/XLx8XhXpe+LDYAbpGKZYSwtlyyLOtS/8aD7A==";
    const merchantData = timestamp + iMid + referenceNo + amt + merchantKey;
    const merchantToken = CryptoJS.SHA256(merchantData).toString(
        CryptoJS.enc.Hex
    );

    registrationData = {
        timeStamp: timestamp,
        iMid: "OVOTEST001",
        payMethod: "05",
        currency: "IDR",
        amt: "19000",
        referenceNo: referenceNo,
        goodsNm: "Nokia 3360",
        billingNm: "John Doe",
        billingPhone: "087880808515",
        billingEmail: "email@customer.com",
        billingCity: "Jakarta",
        billingState: "DKI Jakarta",
        billingPostCd: "12870",
        billingCountry: "ID",
        reqDomain: "merchant.com",
        reqServerIP: "127.0.0.1",
        reqClientVer: "",
        userIP: "127.0.0.1",
        userSessionID: "",
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,like Gecko) Chrome/60.0.3112.101 Safari/537.36",
        userLanguage: "ko-KR,en-US;q=0.8,ko;q=0.6,en;q=0.4",
        cartData:
            '{"count":"1","item":[{"img_url":"https://d3nevzfk7ii3be.cloudfront.net/igi/vOrGHXlovukA566A.medium","goods_name":"Nokia 3360","goods_detail":"Old Nokia 3360","goods_amt":"19000"}]}',
        dbProcessUrl: "https://ptsv2.com/t/test-nicepay-ovo/post",
        merchantToken: merchantToken,
        mitraCd: "OVOE",
        description: "",
        instmntType: "",
        instmntMon: "",
        recurrOpt: "",
        bankCd: "",
        vacctValidDt: "",
        vacctValidTm: "",
        merFixAcctId: "",
        msId: "",
        msFee: "",
        msFeeType: "",
        escrowCl: "",
    };
    try {
        const regRes = await axios.post(
            "https://dev.nicepay.co.id/nicepay/direct/v2/registration",
            JSON.stringify(registrationData),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        //TODO: logic jika registrasi sukses / gagal
        //Asumsi sukses
        console.log(regRes.data);
        tXid = regRes.data.tXid;
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }

    // Payment Process
    var data = qs.stringify({
        timeStamp: timestamp,
        tXid: tXid,
        referenceNo: referenceNo,
        callBackUrl: "http://localhost:3000/api/v1/payment-notif",
        merchantToken:merchantToken,
    });
    var config = {
        method: "post",
        url: "https://dev.nicepay.co.id/nicepay/direct/v2/payment",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
    };

    try {
        console.log(data);
        const notifRes = await axios(config)
        
        console.log((notifRes.data));
        return res.status(200).json({});
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
};

const paymentNotification = (req, res) => {
    return res.status(200).json({
        message: "Transaksi anda berhasil"
    })
};

module.exports = {
    ovoPayment,
    paymentNotification,
};
