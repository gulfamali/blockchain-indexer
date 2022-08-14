const Response = (res, data) => {
    console.log(data);

    const http = data?.http || 200;

    res.status(http).json({
        status: (http === 200 || http === 201) ? 1: 0,
        statusCode: http,
        data: data.result || null,
        message: data.message || 'Ok'
    })
}

module.exports = Response;