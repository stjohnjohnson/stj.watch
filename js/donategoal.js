
(function ($) {

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });
    $.fn.donateGoal = function (participantID) {

        var progressBar = this,
            progressValue = progressBar.children(".progress-value"),
            donationGoal = 0,
            donationValue = 0,
            donationPercent = donationValue / donationGoal;

        progressBar.progressbar({
            value: false
        });

        function getLatestData() {
            $.ajax({
                url: 'https://www.extra-life.org/api/participants/' + participantID,
                type: 'GET',
                data: '',
                dataType: 'json',
                cache: false,
                success: function (res) {
                    donationValue = res.sumDonations;
                    donationGoal = res.fundraisingGoal;
                    donationPercent = Math.round(donationValue / donationGoal * 100);

                    progressValue.text(formatter.format(donationValue) + " (" + donationPercent + "%)");
                    progressBar.progressbar("value", Math.min(donationPercent, 100));
                },
                error: function (res) {
                    console.error(res);
                }
            });
        }

        setInterval(getLatestData, 60 * 1000);
        getLatestData();
    };
})(jQuery);