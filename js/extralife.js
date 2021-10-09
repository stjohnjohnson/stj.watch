
(function ($) {

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });
    $.fn.donateGoal = function (participantID) {

        var progressBar = this.find(".progress-bar"),
            progressValue = this.find(".progress-value"),
            progressPerc = this.find(".progress-perc"),
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

                    progressValue.text(formatter.format(donationValue) + " raised");
                    progressPerc.text(donationPercent + "%");
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
    $.fn.currentRaised = function (participantID) {
        var displayText = this,
            donationGoal = 0,
            donationValue = 0,
            donationPercent = donationValue / donationGoal;

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

                    displayText.text(formatter.format(donationValue) + " (" + donationPercent + "%) raised so far");
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