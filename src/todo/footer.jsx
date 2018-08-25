import '../assets/styles/footer.styl'

export default {
    data: function() {
        return {
            author: 'Jocky'
        }
    },
    render() {
        return (
            <div id="footer">
                <span>Written by {this.author}</span>
            </div>
        )
    }
}